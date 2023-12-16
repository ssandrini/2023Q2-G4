const { Client } = require('pg');

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
    };

    const requestBody = JSON.parse(event.body);

    const { created_by, name } = requestBody;

    const insertBoardQuery = `
        INSERT INTO boards (created_by, name)
        VALUES ($1, $2)
        RETURNING *;
    `;

    const client = new Client(dbConfig);

    try {
        // Connect to the database
        await client.connect();

        // TODO: Check if the provided 'created_by' exists in the 'users' table

        // Execute the INSERT query
        const result = await client.query(insertBoardQuery, [created_by, name]);

        // Close the database connection
        await client.end();

        // Send the newly created board as the response
        response.body = JSON.stringify(result.rows[0]);
    } catch (error) {
        // Handle errors
        console.error('Error creating board:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};
