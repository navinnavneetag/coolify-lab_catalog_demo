import pool from "../config/db.js";

export const dataDb = {
  insert: async (
    lab_name,
    main_food_category,
    test_category,
    test_sub_category,
    parameter
  ) => {
    const insertQuery = `
      INSERT INTO lab_data (lab_name, main_food_category, test_category, test_sub_category, parameter) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;
    const result = await pool.query(insertQuery, [
      lab_name,
      main_food_category,
      test_category,
      test_sub_category,
      parameter,
    ]);
    return result.rows[0];
  },

  insertBatch: async (dataBatch) => {
    try {
      const uniqueLabsWithRegionState = dataBatch.map((row) => ({
        lab_name: row.lab_name,
        region: row.region,
        state: row.state,
      }));

      const labValues = uniqueLabsWithRegionState
        .map((lab) => `('${lab.lab_name}', '${lab.region}', '${lab.state}')`)
        .join(",");
      const uniqueLabs = [...new Set(dataBatch.map((row) => row.lab_name))];
      const uniqueFoodCategories = [
        ...new Set(dataBatch.map((row) => row.main_food_category)),
      ];
      const uniqueTestSubCategories = [
        ...new Set(dataBatch.map((row) => row.test_sub_category)),
      ];
      const uniqueParameters = [
        ...new Set(dataBatch.map((row) => row.parameter)),
      ];
      const uniqueProducts = [...new Set(dataBatch.map((row) => row.product))];

      await pool.query(`
        INSERT INTO labs (lab_name, region, state)
        VALUES ${labValues}
        ON CONFLICT (lab_name) DO NOTHING
      `);

      await pool.query(
        `INSERT INTO main_food_categories (main_food_category)
         SELECT unnest($1::text[])
         ON CONFLICT (main_food_category) DO NOTHING`,
        [uniqueFoodCategories]
      );

      await pool.query(
        `INSERT INTO test_sub_categories (test_sub_category)
         SELECT unnest($1::text[])
         ON CONFLICT (test_sub_category) DO NOTHING`,
        [uniqueTestSubCategories]
      );

      await pool.query(
        `INSERT INTO parameters (parameter)
         SELECT unnest($1::text[])
         ON CONFLICT (parameter) DO NOTHING`,
        [uniqueParameters]
      );

      for (const product of uniqueProducts) {
        await pool.query(
          `INSERT INTO products (product)
           VALUES ($1)
           ON CONFLICT DO NOTHING`,
          [product]
        );
      }

      const labs = await pool.query(
        "SELECT lab_id, lab_name FROM labs WHERE lab_name = ANY($1)",
        [uniqueLabs]
      );
      const foodCategories = await pool.query(
        "SELECT main_food_category_id, main_food_category FROM main_food_categories WHERE main_food_category = ANY($1)",
        [uniqueFoodCategories]
      );
      const testSubCategories = await pool.query(
        "SELECT test_sub_category_id, test_sub_category FROM test_sub_categories WHERE test_sub_category = ANY($1)",
        [uniqueTestSubCategories]
      );
      const parameters = await pool.query(
        "SELECT parameter_id, parameter FROM parameters WHERE parameter = ANY($1)",
        [uniqueParameters]
      );
      const products = await pool.query(
        "SELECT product_id, product FROM products WHERE product = ANY($1)",
        [uniqueProducts]
      );

      const labMap = new Map(
        labs.rows.map((row) => [row.lab_name, row.lab_id])
      );
      const foodCategoryMap = new Map(
        foodCategories.rows.map((row) => [
          row.main_food_category,
          row.main_food_category_id,
        ])
      );
      const testSubCategoryMap = new Map(
        testSubCategories.rows.map((row) => [
          row.test_sub_category,
          row.test_sub_category_id,
        ])
      );
      const parameterMap = new Map(
        parameters.rows.map((row) => [row.parameter, row.parameter_id])
      );
      const productMap = new Map(
        products.rows.map((row) => [row.product, row.product_id])
      );

      const labDataValues = dataBatch.map((row) => [
        labMap.get(row.lab_name),
        foodCategoryMap.get(row.main_food_category),
        testSubCategoryMap.get(row.test_sub_category),
        parameterMap.get(row.parameter),
        productMap.get(row.product),
        row.test_category,
      ]);

      const insertQuery = `
        INSERT INTO lab_data (
          lab_id,
          main_food_category_id,
          test_sub_category_id,
          parameter_id,
          product_id,
          test_category
        )
        SELECT * FROM unnest($1::int[], $2::int[], $3::int[], $4::int[], $5::int[], $6::text[])
        RETURNING *`;

      const result = await pool.query(insertQuery, [
        labDataValues.map((row) => row[0]),
        labDataValues.map((row) => row[1]),
        labDataValues.map((row) => row[2]),
        labDataValues.map((row) => row[3]),
        labDataValues.map((row) => row[4]),
        labDataValues.map((row) => row[5]),
      ]);

      console.log(`Inserted ${result.rows.length} records into lab_data.`);
      return result.rows;
    } catch (error) {
      console.error("Error in batch insert:", error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    const queries = {
      mainQuery: `
      WITH lab_grouped_data AS (
        SELECT 
          l.lab_name, 
          COUNT(*) AS entry_count
        FROM lab_data ld
        JOIN labs l ON ld.lab_id = l.lab_id
        GROUP BY l.lab_name
      ),
      test_grouped_data AS (
        SELECT 
          tsc.test_sub_category, 
          COUNT(*) AS entry_count
        FROM lab_data ld
        JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
        GROUP BY tsc.test_sub_category
      )
      SELECT 
        (SELECT COUNT(DISTINCT lab_id) FROM labs) AS total_labs,
        (SELECT COUNT(lab_data_id) FROM lab_data) AS total_entries,
        (SELECT COUNT(DISTINCT main_food_category_id) FROM main_food_categories) AS total_food_categories,
        (SELECT COUNT(DISTINCT test_sub_category_id) FROM test_sub_categories) AS total_test_categories,
        (SELECT json_agg(json_build_object('name', lab_name, 'entry_count', entry_count)) FROM lab_grouped_data) AS lab_grouped,
        (SELECT json_agg(json_build_object('name', test_sub_category, 'entry_count', entry_count)) FROM test_grouped_data) AS test_grouped;
      `,

      crossTab: `
      SELECT 
        grouped_data.lab_name,
        json_agg(json_build_object('category', grouped_data.main_food_category, 'entry_count', grouped_data.entry_count)) AS main_food_category 
      FROM ( 
        SELECT 
          l.lab_name,
          mfc.main_food_category,
          COUNT(*) AS entry_count 
        FROM lab_data ld
        JOIN labs l ON ld.lab_id = l.lab_id
        JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
        GROUP BY l.lab_name, mfc.main_food_category
        ORDER BY l.lab_name, mfc.main_food_category
      ) AS grouped_data 
      GROUP BY grouped_data.lab_name 
      ORDER BY grouped_data.lab_name;
      `,

      uniqueCategories: `
      SELECT 
        ARRAY_AGG(DISTINCT l.lab_name) AS lab_names,
        ARRAY_AGG(DISTINCT mfc.main_food_category) AS food_categories,
        ARRAY_AGG(DISTINCT tsc.test_sub_category) AS test_categories,
        ARRAY_AGG(DISTINCT ld.test_category) AS test_category,
        ARRAY_AGG(DISTINCT p.parameter) AS parameter,
        ARRAY_AGG(DISTINCT pr.product) AS product,
        ARRAY_AGG(DISTINCT l.region) AS region,
        ARRAY_AGG(DISTINCT l.state) AS state
      FROM lab_data ld
      JOIN labs l ON ld.lab_id = l.lab_id
      JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
      JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
      JOIN parameters p ON ld.parameter_id = p.parameter_id
      JOIN products pr ON ld.product_id = pr.product_id;
      `,

      labScopePercentage: `
        WITH filtered_data AS (
          SELECT
              l.lab_name,
              p.parameter
          FROM
              lab_data ld
              JOIN labs l ON ld.lab_id = l.lab_id
              JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
              JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
              JOIN parameters p ON ld.parameter_id = p.parameter_id
        ),
        unique_parameters AS (
          SELECT
              DISTINCT parameter
          FROM
              filtered_data
        ),
        lab_parameters AS (
          SELECT
              lab_name,
              COUNT(DISTINCT parameter) AS parameter_count
          FROM
              filtered_data
          GROUP BY lab_name
        ),
        total_parameters AS (
          SELECT
              COUNT(*) AS total_parameter_count
          FROM
              unique_parameters
        )
        SELECT
          lp.lab_name AS name,
          lp.parameter_count as parameter_count,
          tp.total_parameter_count as total_parameter_count,
          CAST(ROUND((lp.parameter_count::NUMERIC / tp.total_parameter_count) * 100, 2) AS DOUBLE PRECISION) AS entry_count
        FROM
          lab_parameters lp,
          total_parameters tp
        ORDER BY entry_count DESC;
        `,

      state_grouped_data: `
          SELECT 
            l.state,
            ARRAY_AGG(l.lab_name) as labs
          FROM 
            labs l
          GROUP BY 
            l.state
          ORDER BY 
            l.state
        `,

      downloadLabData: `
          SELECT 
            l.lab_name as labs
          FROM labs l
          JOIN lab_data ld ON l.lab_id = ld.lab_id 
          JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
          JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
          JOIN parameters p ON ld.parameter_id = p.parameter_id
          JOIN products pr ON ld.product_id = pr.product_id
          GROUP BY l.lab_name
        `,
    };

    const [
      mainQuery,
      crossTab,
      uniqueCategories,
      labScopePercentage,
      stateGroupedData,
      downloadLabData,
    ] = await Promise.all([
      pool.query(queries.mainQuery),
      pool.query(queries.crossTab),
      pool.query(queries.uniqueCategories),
      pool.query(queries.labScopePercentage),
      pool.query(queries.state_grouped_data),
      pool.query(queries.downloadLabData),
    ]);

    return {
      totalLabs: mainQuery.rows[0].total_labs,
      totalEntries: mainQuery.rows[0].total_entries,
      totalFood: mainQuery.rows[0].total_food_categories,
      totalTest: mainQuery.rows[0].total_test_categories,
      labGrouped: mainQuery.rows[0].lab_grouped,
      testGrouped: mainQuery.rows[0].test_grouped,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0],
      labScopePercentage: labScopePercentage.rows,
      stateGroupedData: stateGroupedData.rows,
      downloadLabData: downloadLabData.rows,
    };
  },

  getFilteredDashboardStats: async (filters) => {
    const {
      lab_name,
      main_food_category,
      test_sub_category,
      test_category,
      parameter,
      product,
      region,
      state,
    } = filters;

    const whereConditions = [];
    const queryParams = [];
    let paramCounter = 1;

    if (Array.isArray(lab_name) && lab_name.length > 0) {
      whereConditions.push(`l.lab_name = ANY($${paramCounter})`);
      queryParams.push(lab_name);
      paramCounter++;
    }

    if (Array.isArray(main_food_category) && main_food_category.length > 0) {
      whereConditions.push(`mfc.main_food_category = ANY($${paramCounter})`);
      queryParams.push(main_food_category);
      paramCounter++;
    }

    if (Array.isArray(test_sub_category) && test_sub_category.length > 0) {
      whereConditions.push(`tsc.test_sub_category = ANY($${paramCounter})`);
      queryParams.push(test_sub_category);
      paramCounter++;
    }

    if (Array.isArray(test_category) && test_category.length > 0) {
      whereConditions.push(`ld.test_category = ANY($${paramCounter})`);
      queryParams.push(test_category);
      paramCounter++;
    }

    if (Array.isArray(parameter) && parameter.length > 0) {
      whereConditions.push(`p.parameter = ANY($${paramCounter})`);
      queryParams.push(parameter);
      paramCounter++;
    }

    if (Array.isArray(product) && product.length > 0) {
      whereConditions.push(`pr.product = ANY($${paramCounter})`);
      queryParams.push(product);
      paramCounter++;
    }

    if (Array.isArray(region) && region.length > 0) {
      whereConditions.push(`l.region = ANY($${paramCounter})`);
      queryParams.push(region);
      paramCounter++;
    }

    if (Array.isArray(state) && state.length > 0) {
      whereConditions.push(`l.state = ANY($${paramCounter})`);
      queryParams.push(state);
      paramCounter++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const queries = {
      mainQuery: `
            WITH lab_grouped_data AS (
                SELECT 
                    l.lab_name, 
                    COUNT(*) AS entry_count
                FROM lab_data ld
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}
                GROUP BY l.lab_name
            ),
            test_grouped_data AS (
                SELECT 
                    tsc.test_sub_category, 
                    COUNT(*) AS entry_count
                FROM lab_data ld
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}
                GROUP BY tsc.test_sub_category
            )
            SELECT 
                (SELECT COUNT(DISTINCT l.lab_id) FROM lab_data ld
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}) AS total_labs,
                (SELECT COUNT(*) FROM lab_data ld
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}) AS total_entries,
                (SELECT COUNT(DISTINCT mfc.main_food_category_id) FROM lab_data ld
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}) AS total_food_categories,
                (SELECT COUNT(DISTINCT tsc.test_sub_category_id) FROM lab_data ld
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}) AS total_test_categories,
                (SELECT json_agg(json_build_object('name', lab_name, 'entry_count', entry_count)) FROM lab_grouped_data) AS lab_grouped,
                (SELECT json_agg(json_build_object('name', test_sub_category, 'entry_count', entry_count)) FROM test_grouped_data) AS test_grouped;
        `,

      crossTab: `
            SELECT 
                grouped_data.lab_name,
                json_agg(
                    json_build_object(
                        'category', grouped_data.main_food_category, 
                        'entry_count', grouped_data.entry_count
                    )
                ) AS main_food_category 
            FROM (
                SELECT 
                    l.lab_name,
                    mfc.main_food_category,
                    COUNT(*) AS entry_count 
                FROM lab_data ld
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                JOIN products pr ON ld.product_id = pr.product_id
                ${whereClause}
                GROUP BY l.lab_name, mfc.main_food_category
                ORDER BY l.lab_name, mfc.main_food_category
            ) AS grouped_data 
            GROUP BY grouped_data.lab_name 
            ORDER BY grouped_data.lab_name;
        `,

      uniqueCategories: `
            WITH filtered_labs AS (
                SELECT DISTINCT l.lab_id
                FROM lab_data ld
                JOIN labs l ON ld.lab_id = l.lab_id
                JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
                JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
                JOIN products pr ON ld.product_id = pr.product_id
                JOIN parameters p ON ld.parameter_id = p.parameter_id
                ${whereClause}
            )
            SELECT 
                (SELECT ARRAY_AGG(DISTINCT l.lab_name) FROM labs l) AS lab_names,
                (
                    SELECT ARRAY_AGG(DISTINCT mfc.main_food_category) 
                    FROM main_food_categories mfc 
                    JOIN lab_data ld ON mfc.main_food_category_id = ld.main_food_category_id
                    WHERE ld.lab_id IN (SELECT lab_id FROM filtered_labs)
                ) AS food_categories,
                (
                    SELECT ARRAY_AGG(DISTINCT tsc.test_sub_category) 
                    FROM test_sub_categories tsc 
                    JOIN lab_data ld ON tsc.test_sub_category_id = ld.test_sub_category_id
                    WHERE ld.lab_id IN (SELECT lab_id FROM filtered_labs)
                ) AS test_categories,
                (
                    SELECT ARRAY_AGG(DISTINCT p.parameter) 
                    FROM parameters p 
                    JOIN lab_data ld ON p.parameter_id = ld.parameter_id
                    WHERE ld.lab_id IN (SELECT lab_id FROM filtered_labs)
                ) AS parameter,
                (
                    SELECT ARRAY_AGG(DISTINCT pr.product) 
                    FROM products pr 
                    JOIN lab_data ld ON pr.product_id = ld.product_id
                    WHERE ld.lab_id IN (SELECT lab_id FROM filtered_labs)
                ) AS product,
                (
                    SELECT ARRAY_AGG(DISTINCT l.region) 
                    FROM labs l 
                ) AS region,
                (
                    SELECT ARRAY_AGG(DISTINCT l.state) 
                    FROM labs l 
                ) AS state;
        `,

      labScopePercentage: `
          WITH filtered_data AS (
            SELECT
              l.lab_name,
              p.parameter
            FROM
              lab_data ld
              JOIN labs l ON ld.lab_id = l.lab_id
              JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
              JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
              JOIN parameters p ON ld.parameter_id = p.parameter_id
              JOIN products pr ON ld.product_id = pr.product_id
            ${whereClause}
          ),
          unique_parameters AS (
            SELECT
              DISTINCT parameter
            FROM
            filtered_data
          ),
          lab_parameters AS (
            SELECT
              lab_name,
              COUNT(DISTINCT parameter) AS parameter_count
            FROM
            filtered_data
            GROUP BY lab_name
          ),
          total_parameters AS (
            SELECT
              COUNT(*) AS total_parameter_count
            FROM
            unique_parameters
          )
          SELECT
            lp.lab_name as name,
            lp.parameter_count as parameter_count,
            tp.total_parameter_count as total_parameter_count,
            CAST(ROUND((lp.parameter_count::NUMERIC / tp.total_parameter_count) * 100, 2) AS DOUBLE PRECISION) AS entry_count
          FROM lab_parameters lp, total_parameters tp
          ORDER BY entry_count DESC;
        `,

      state_grouped_data: `
          SELECT 
            l.state,
            ARRAY_AGG(DISTINCT l.lab_name) as labs
          FROM 
            labs l
          JOIN lab_data ld ON l.lab_id = ld.lab_id
          JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
          JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
          JOIN parameters p ON ld.parameter_id = p.parameter_id
          JOIN products pr ON ld.product_id = pr.product_id
          ${whereClause}
          GROUP BY 
            l.state
          ORDER BY 
            l.state
        `,

      downloadLabData: `
          SELECT 
            l.lab_name as labs
          FROM labs l
          JOIN lab_data ld ON l.lab_id = ld.lab_id 
          JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
          JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
          JOIN parameters p ON ld.parameter_id = p.parameter_id
          JOIN products pr ON ld.product_id = pr.product_id
          ${whereClause}
          GROUP BY l.lab_name
        `,
    };

    const [
      mainQuery,
      crossTab,
      uniqueCategories,
      labScopePercentage,
      stateGroupedData,
      downloadLabData,
    ] = await Promise.all([
      pool.query(queries.mainQuery, queryParams),
      pool.query(queries.crossTab, queryParams),
      pool.query(queries.uniqueCategories, queryParams),
      pool.query(queries.labScopePercentage, queryParams),
      pool.query(queries.state_grouped_data, queryParams),
      pool.query(queries.downloadLabData, queryParams),
    ]);

    return {
      totalLabs: mainQuery.rows[0].total_labs,
      totalEntries: mainQuery.rows[0].total_entries,
      totalFood: mainQuery.rows[0].total_food_categories,
      totalTest: mainQuery.rows[0].total_test_categories,
      labGrouped: mainQuery.rows[0].lab_grouped,
      testGrouped: mainQuery.rows[0].test_grouped,
      crossTab: crossTab.rows,
      uniqueCategories: uniqueCategories.rows[0],
      labScopePercentage: labScopePercentage.rows,
      stateGroupedData: stateGroupedData.rows,
      downloadLabData: downloadLabData.rows,
    };
  },

  downloadLabData: async (labs, filterBody) => {
    filterBody.lab_name = labs;

    const {
      lab_name,
      main_food_category,
      test_sub_category,
      test_category,
      parameter,
      region,
      state,
    } = filterBody;

    const whereConditions = [];
    const queryParams = [];
    let paramCounter = 1;

    if (Array.isArray(lab_name) && lab_name.length > 0) {
      whereConditions.push(`l.lab_name = ANY($${paramCounter})`);
      queryParams.push(lab_name);
      paramCounter++;
    }

    if (Array.isArray(main_food_category) && main_food_category.length > 0) {
      whereConditions.push(`mfc.main_food_category = ANY($${paramCounter})`);
      queryParams.push(main_food_category);
      paramCounter++;
    }

    if (Array.isArray(test_sub_category) && test_sub_category.length > 0) {
      whereConditions.push(`tsc.test_sub_category = ANY($${paramCounter})`);
      queryParams.push(test_sub_category);
      paramCounter++;
    }

    if (Array.isArray(test_category) && test_category.length > 0) {
      whereConditions.push(`ld.test_category = ANY($${paramCounter})`);
      queryParams.push(test_category);
      paramCounter++;
    }

    if (Array.isArray(parameter) && parameter.length > 0) {
      whereConditions.push(`p.parameter = ANY($${paramCounter})`);
      queryParams.push(parameter);
      paramCounter++;
    }

    if (Array.isArray(region) && region.length > 0) {
      whereConditions.push(`l.region = ANY($${paramCounter})`);
      queryParams.push(region);
      paramCounter++;
    }

    if (Array.isArray(state) && state.length > 0) {
      whereConditions.push(`l.state = ANY($${paramCounter})`);
      queryParams.push(state);
      paramCounter++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const data = await pool.query(
      `
        WITH lab_data_grouped AS (
          SELECT 
            l.lab_name,
            json_agg(
              json_build_object(
                'main_food_category', mfc.main_food_category,
                'test_sub_category', tsc.test_sub_category,
                'test_category', ld.test_category,
                'parameter', p.parameter,
                'region', l.region,
                'state', l.state
              )
            ) AS tests
          FROM labs l
          JOIN lab_data ld ON l.lab_id = ld.lab_id 
          JOIN main_food_categories mfc ON ld.main_food_category_id = mfc.main_food_category_id
          JOIN test_sub_categories tsc ON ld.test_sub_category_id = tsc.test_sub_category_id
          JOIN parameters p ON ld.parameter_id = p.parameter_id
          ${whereClause}
          GROUP BY l.lab_name
        )
        SELECT 
          lab_name,
          tests
        FROM lab_data_grouped
      `,
      queryParams
    );

    return data.rows;
  },
};
