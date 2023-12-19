const { Client } = require('pg');
const { SNSClient, SubscribeCommand } = require("@aws-sdk/client-sns");

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

    let username, boardId;

    try {
        const requestBody = JSON.parse(event.body);
        username = requestBody.username;
        const pathMatch = event.path.match(/\/boards\/(\d+)/);

        if (pathMatch && pathMatch[1]) {
            boardId = parseInt(pathMatch[1], 10);
        } else {
            response.statusCode = 400;
            response.body = 'Invalid URL format';
            return response;
        }

        if (!username) {
            throw new Error('Username is missing');
        }
    } catch (error) {
        console.error('Error extracting parameters from the request body:', error);
        response.statusCode = 400;
        response.body = 'Invalid request body';
        return response;
    }

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

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

        if (error.code === '23502') {
            response.statusCode = 400;
            response.body = 'Invalid request. The specified user does not exist in the users table.';
        } else {
            response.statusCode = 500;
            response.body = 'Internal Server Error';
        }
        return response;
    }

    const snsClient = new SNSClient({});

    try {
        const filterPolicy = {
            boardId: [boardId]
          };

        console.log('Subscribing to SNS...');
        const sns_response = await snsClient.send(
            new SubscribeCommand({
                Protocol: "email",
                TopicArn: process.env.SNS_HOST,
                Endpoint: username,
                Attributes: {
                    FilterPolicy: JSON.stringify(filterPolicy)
                  }
            }),
        );
    
        console.log('Subscription successful:', sns_response);
     
    } catch (error) {
        console.error('Error subscribing email:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};
