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
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,PATCH",
            "Access-Control-Allow-Credentials": "true"
        },
    };

    let username;

    try {
        username = event.queryStringParameters.username;

        if (!username) {
            throw new Error('Username parameter is missing');
        }
    } catch (error) {
        console.error('Username parameter is missing:', error);
        response.statusCode = 400; // Bad Request
        response.body = 'Username parameter is missing';
        return response;
    }

    const getBoardsQuery = {
        text: `
            SELECT 
                b.*,
                array_agg(u.username) AS usernames
            FROM 
                boards b
            JOIN 
                user_board_relation ubr ON b.board_id = ubr.board_id
            JOIN 
                users u ON ubr.user_id = u.user_id
            WHERE 
                b.board_id IN (
                    SELECT board_id
                    FROM user_board_relation
                    WHERE user_id = (
                        SELECT user_id
                        FROM users
                        WHERE username = $1
                    )
                )
            GROUP BY 
                b.board_id
        `,
        values: [username],
    };

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the getBoards query...');
        const result = await client.query(getBoardsQuery);
        console.log('getBoards query executed successfully.');

        const boards = result.rows;

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = JSON.stringify({ boards });
    } catch (error) {
        console.error('Error fetching boards:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    return response;
};