const { Client } = require('pg');

//Esta lambda levanta todas las tablas en el RDS.
//Se debe correr solo 1 vez, a mano, al instanciar por primera vez la arquitectura
//Por eso, esta lambda no tiene ni endpoint para pegarle ni nada similar

exports.handler = async (event, context) => {
    const dbConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    };

    const response = {
        statusCode: 200,
        body: '',
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,PATCH",
            "Access-Control-Allow-Credentials": "true"
        },
    };

    const createTableQuery = `
	-- Create users table
	CREATE TABLE IF NOT EXISTS users (
	    user_id SERIAL PRIMARY KEY,
	    username VARCHAR(255) NOT NULL UNIQUE,
	    role VARCHAR(20) CHECK (role IN ('MANAGER', 'DEVELOPER')),
	    cognito_sub VARCHAR(255) NOT NULL UNIQUE
	);

	-- Create boards table
	CREATE TABLE IF NOT EXISTS boards (
	    board_id SERIAL PRIMARY KEY,
	    created_by VARCHAR(255) REFERENCES users(username),
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    name VARCHAR(255) NOT NULL
	);

	-- Create bugs table
	CREATE TABLE IF NOT EXISTS bugs (
	    bug_id SERIAL PRIMARY KEY,
	    name VARCHAR(255) NOT NULL,
	    description TEXT,
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    due_by TIMESTAMP,
	    stage VARCHAR(20) CHECK (stage IN ('icebox', 'to-do', 'doing', 'done')),
	    board_id INT REFERENCES boards(board_id)
	);

	-- Create user-board-relation table
	CREATE TABLE IF NOT EXISTS user_board_relation (
	    user_id INT REFERENCES users(user_id),
	    board_id INT REFERENCES boards(board_id),
	    PRIMARY KEY (user_id, board_id)
	);
    `;

    const client = new Client(dbConfig);

    try {
        await client.connect();

        await client.query(createTableQuery);

        await client.end();

        response.body = 'Tables created successfully';
    } catch (error) {
        console.error('Error creating table:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};