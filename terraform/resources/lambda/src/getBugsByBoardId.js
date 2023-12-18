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

    let boardId;

    try {
        // Extract board_id from the query parameters
        boardId = event.queryStringParameters.board_id;

        if (!boardId) {
            throw new Error('Board_id parameter is missing');
        }
    } catch (error) {
        console.error('Error extracting board_id from the query parameters:', error);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid request parameters';
        return response;
    }

    const getBugsQuery = {
        text: `
            SELECT *
            FROM bugs
            WHERE board_id = $1
        `,
        values: [boardId],
    };

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the getBugs query...');
        const result = await client.query(getBugsQuery);
        console.log('getBugs query executed successfully.');

        const bugs = result.rows;

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = JSON.stringify({ bugs });
    } catch (error) {
        console.error('Error fetching bugs:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    return response;
};
