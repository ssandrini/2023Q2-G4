//js lambda code

// Use require syntax for modules (CommonJS) since it's a JavaScript file
const { Client } = require('pg');


console.log("antes");

exports.handler = async (event, context) => {
    // RDS connection details
    const dbConfig = {
        user: 'Leandro',
        host: "my-rds-proxy.proxy-cg9gvpc0qjej.us-east-1.rds.amazonaws.com",
        database: 'primarydb',
        password: 'LeandroEsUnCapo123',
        port: 5432,
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

	-- Insert sample data into users table with Disney characters
	INSERT INTO users (username, role, cognito_sub) VALUES
	    ('waltdisney', 'manager', 'cognito_sub_waltdisney'),
	    ('micky', 'developer', 'cognito_sub_micky'),
	    ('cinderella', 'developer', 'cognito_sub_cinderella');

	-- Insert sample data into boards table for Disney movies
	INSERT INTO boards (created_by, name) VALUES
	    ('waltdisney', 'disney-classic-bugs'),
	    ('waltdisney', 'pixar-bugs');

	-- Insert sample data into bugs table for Disney movies
	INSERT INTO bugs (name, description, due_by, stage, board_id) VALUES
	    ('plot-hole-in-cinderella', 'fix-continuity-issue-in-cinderella-storyline', '2023-12-31', 'to-do', 1),
	    ('animation-glitch-in-toy-story', 'fix-animation-issue-in-toy-story-scene', '2023-12-31', 'doing', 2),
	    ('character-design-error-in-frozen', 'correct-character-design-mistake-in-frozen', '2023-12-31', 'icebox', 1);

	-- Insert sample data into user-board-relation table
	INSERT INTO user_board_relation (user_id, board_id) VALUES
	    (1, 1), -- Walt Disney manages Disney Classic Bugs
	    (2, 1), -- Micky is a developer for Disney Classic Bugs
	    (3, 2); -- Cinderella is a developer for Pixar Bugs;
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

