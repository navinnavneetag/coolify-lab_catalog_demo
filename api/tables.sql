-- Table: labs
CREATE TABLE labs (
    lab_id SERIAL PRIMARY KEY,
    lab_name VARCHAR(255) NOT NULL UNIQUE
);

-- Table: main_food_categories
CREATE TABLE main_food_categories (
    main_food_category_id SERIAL PRIMARY KEY,
    main_food_category VARCHAR(255) NOT NULL UNIQUE
);

-- Table: test_sub_categories
CREATE TABLE test_sub_categories (
    test_sub_category_id SERIAL PRIMARY KEY,
    test_sub_category VARCHAR(255) NOT NULL UNIQUE
);

-- Table: parameters
CREATE TABLE parameters (
    parameter_id SERIAL PRIMARY KEY,
    parameter VARCHAR(255) NOT NULL UNIQUE
);

-- Table: products
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product VARCHAR(255) NOT NULL UNIQUE
);

-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table: lab_data
CREATE TABLE lab_data (
    lab_data_id SERIAL PRIMARY KEY,
    lab_id INT NOT NULL REFERENCES labs(lab_id) ON DELETE CASCADE,
    main_food_category_id INT NOT NULL REFERENCES main_food_categories(main_food_category_id) ON DELETE CASCADE,
    test_sub_category_id INT NOT NULL REFERENCES test_sub_categories(test_sub_category_id) ON DELETE CASCADE,
    parameter_id INT NOT NULL REFERENCES parameters(parameter_id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    test_category VARCHAR(255) NOT NULL
);

-- Indexes for labs
CREATE INDEX idx_labs_lab_name ON labs(lab_name);

-- Indexes for main_food_categories
CREATE INDEX idx_main_food_categories_category ON main_food_categories(main_food_category);

-- Indexes for test_sub_categories
CREATE INDEX idx_test_sub_categories_category ON test_sub_categories(test_sub_category);

-- Indexes for parameters
CREATE INDEX idx_parameters_parameter ON parameters(parameter);

-- IMPORTANT NOTE
-- No index for product column in product table yet since it has very large values for some rows and it causes btree error

-- Indexes for lab_data
CREATE INDEX idx_lab_data_lab_id ON lab_data(lab_id);
CREATE INDEX idx_lab_data_main_food_category_id ON lab_data(main_food_category_id);
CREATE INDEX idx_lab_data_test_sub_category_id ON lab_data(test_sub_category_id);
CREATE INDEX idx_lab_data_parameter_id ON lab_data(parameter_id);