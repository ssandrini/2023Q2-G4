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
            "Access-Control-Allow-Origin": "https://www.example.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
    };
    
    let insertedBoard;
    const requestBody = JSON.parse(event.body);
    const { created_by, name } = requestBody;

    try {
        // Check if the user exists in the users table
        const checkUserQuery = {
            text: 'SELECT 1 FROM users WHERE username = $1',
            values: [created_by],
        };

        const client = new Client(dbConfig);
        await client.connect();

        const userCheckResult = await client.query(checkUserQuery);

        if (userCheckResult.rows.length === 0) {
            response.statusCode = 400;
            response.body = 'Invalid user. User does not exist in the users table.';
            return response;
        }

        // Insert the board
        const insertBoardQuery = {
            text: `
                INSERT INTO boards (created_by, name)
                VALUES ($1, $2)
                RETURNING *;
            `,
            values: [created_by, name],
        };

        const boardResult = await client.query(insertBoardQuery);
        insertedBoard = boardResult.rows[0];

        // Insert a row in the user_board_relation table
        const insertRelationQuery = {
            text: `
                INSERT INTO user_board_relation (user_id, board_id)
                VALUES ((SELECT user_id FROM users WHERE username = $1), $2);
            `,
            values: [created_by, insertedBoard.board_id],
        };

        await client.query(insertRelationQuery);

        await client.end();

        response.body = JSON.stringify(insertedBoard);
    } catch (error) {
        console.error('Error creating board:', error);

        // Check if the error is due to a foreign key constraint violation
        if (error.code === '23503') {
            response.statusCode = 400;
            response.body = 'Invalid request. The specified user does not exist in the users table.';
        } else {
            response.statusCode = 500;
            response.body = 'Internal Server Error';
        }
    }

    //add user to topic with filter
    const snsClient = new SNSClient({});

    try {
        const filterPolicy = {
            boardId: [insertedBoard.board_id]
          };

        console.log('Subscribing to SNS...');
        const sns_response = await snsClient.send(
            new SubscribeCommand({
                Protocol: "email",
                TopicArn: process.env.SNS_HOST,
                Endpoint: created_by,
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