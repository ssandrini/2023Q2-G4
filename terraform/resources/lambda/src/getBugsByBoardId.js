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
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
    };

    let boardId;
    const pathMatch = event.path.match(/\/boards\/(\d+)\/bugs/);
    if (pathMatch && pathMatch[1]) {
        boardId = parseInt(pathMatch[1], 10);
    } else {
        response.statusCode = 400;
        response.body = 'Invalid URL format';
        return response;
    }

    const getBugsQuery = {
        text: `
            SELECT *
            FROM bugs
            WHERE board_id = $1
        `,
        values: [boardId],
    }; //todo fix and make path param

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
