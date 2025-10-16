import xlsx from "xlsx";
import { dataService } from "../services/data.service.js";

function processData() {
  const excel_file = "sheet/sheet.xlsx";
  const workbook = xlsx.readFile(excel_file);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(sheet);

  const processedData = jsonData.map((row) => ({
    lab_name: row["Lab Name"],
    main_food_category: row["Main Food Category"],
    test_category: row["Test Category"],
    test_sub_category: row["Test Sub Category"],
    parameter: row["Parameter"],
    product: row["Product"],
    region: row["Region"],
    state: row["State"],
  }));

  return processedData;
}

async function ingestData() {
  try {
    console.log("Processing data...");
    const processedData = processData();
    const batchSize = 1000;

    console.log("Inserting data into the database...");
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      await dataService.insertDataBatch(batch);
      console.log(`Batch ${i / batchSize + 1} inserted.`);
    }

    console.log(`Ingestion complete. Total records inserted: ${processedData.length}`);
  } catch (error) {
    console.error("Error during data ingestion:", error.message);
  }
}

ingestData();