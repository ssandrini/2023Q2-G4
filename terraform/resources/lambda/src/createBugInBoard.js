const { Client } = require('pg');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

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

    let bugData;

    try {
        bugData = JSON.parse(event.body);
    } catch (error) {
        console.error('Error extracting bug data from the event body:', error);
        response.statusCode = 400;
        response.body = 'Invalid request body';
        return response;
    }

    const { name, description, due_by, stage } = bugData;

    if (!['icebox', 'to-do', 'doing', 'done'].includes(stage)) {
        console.error('Invalid stage:', stage);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid stage. Stage must be "icebox", "to-do", "doing", or "done"';
        return response;
    }

    const pathMatch = event.path.match(/\/boards\/(\d+)\/bugs/);
    let boardId;
    if (pathMatch && pathMatch[1]) {
        boardId = parseInt(pathMatch[1], 10);
    } else {
        response.statusCode = 400;
        response.body = 'Invalid URL format';
        return response;
    }

    const createBugQuery = {
        text: `
            INSERT INTO bugs (name, description, due_by, stage, board_id)
            VALUES ($1, $2, $3, $4, $5)
        `,
        values: [name, description, due_by, stage, boardId],
    };

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the createBug query...');
        await client.query(createBugQuery);
        console.log('createBug query executed successfully.');

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = 'Bug created';
    } catch (error) {
        console.error('Error creating bug:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    //Publish message to topic with attribute for filter
    const snsClient = new SNSClient({});

    try {
        const message = {
            TopicArn: process.env.SNS_HOST,
            Message: 'New bug in your board!',
            MessageAttributes: {
                boardId: {
                DataType: 'Number',
                StringValue: boardId
                },
            }
        };

        const publishResponse = await snsClient.send(new PublishCommand(message));
        console.log('Publish successful:', publishResponse);
     
    } catch (error) {
        console.error('Error Publishing:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};
