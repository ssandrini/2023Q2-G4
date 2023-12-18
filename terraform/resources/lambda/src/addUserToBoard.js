// TODO: endpoint + infra

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

    let username, boardId;

    try {
        const requestBody = JSON.parse(event.body);
        username = requestBody.username;
        boardId = requestBody.board_id;

        if (!username || !boardId) {
            throw new Error('Username or board_id parameter is missing');
        }
    } catch (error) {
        console.error('Error extracting parameters from the request body:', error);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid request body';
        return response;
    }

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        // Check if the user-board relationship already exists
        const checkRelationQuery = {
            text: `
                SELECT 1
                FROM user_board_relation
                WHERE user_id = (SELECT user_id FROM users WHERE username = $1)
                AND board_id = $2;
            `,
            values: [username, boardId],
        };

        const checkResult = await client.query(checkRelationQuery);

        if (checkResult.rows.length > 0) {
            response.statusCode = 400;
            response.body = 'User already exists in the specified board.';
            return response;
        }

        // Insert a row in the user_board_relation table
        const insertRelationQuery = {
            text: `
                INSERT INTO user_board_relation (user_id, board_id)
                VALUES ((SELECT user_id FROM users WHERE username = $1), $2);
            `,
            values: [username, boardId],
        };

        await client.query(insertRelationQuery);

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = 'User added to board successfully';
    } catch (error) {
        console.error('Error adding user to board:', error);

        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};
