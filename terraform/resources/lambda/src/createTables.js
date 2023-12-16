//js lambda code

// Use require syntax for modules (CommonJS) since it's a JavaScript file
const { Client } = require('pg');


console.log("antes");

exports.handler = async (event, context) => {
    // RDS connection details
    const dbConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    };

    // Lambda response object
    const response = {
        statusCode: 200,
        body: '',
    };

    // SQL command to create a table
    const createTableQuery = `
	-- Create users table
	CREATE TABLE users (
	    user_id SERIAL PRIMARY KEY,
	    username VARCHAR(255) NOT NULL UNIQUE,
	    role VARCHAR(20) CHECK (role IN ('manager', 'developer')),
	    cognito_sub VARCHAR(255) NOT NULL UNIQUE
	);

	-- Create boards table
	CREATE TABLE boards (
	    board_id SERIAL PRIMARY KEY,
	    created_by VARCHAR(255) REFERENCES users(username),
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    name VARCHAR(255) NOT NULL
	);

	-- Create bugs table
	CREATE TABLE bugs (
	    bug_id SERIAL PRIMARY KEY,
	    name VARCHAR(255) NOT NULL,
	    description TEXT,
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    due_by TIMESTAMP,
	    stage VARCHAR(20) CHECK (stage IN ('icebox', 'to-do', 'doing', 'done')),
	    board_id INT REFERENCES boards(board_id)
	);

	-- Create user-board-relation table
	CREATE TABLE user_board_relation (
	    user_id INT REFERENCES users(user_id),
	    board_id INT REFERENCES boards(board_id),
	    PRIMARY KEY (user_id, board_id)
	);
    `;


    const client = new Client(dbConfig);

    try {
        // Connect to the database
        await client.connect();

        // Execute the CREATE TABLE query
        await client.query(createTableQuery);

        // Close the database connection
        await client.end();

        response.body = 'Tables created successfully';
    } catch (error) {
        // Handle errors
        console.error('Error creating table:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};

console.log("desp");

