const { Client } = require('pg');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event, context) => {
    // WIP
    // buscar todos los bugs
    // ver cuales se vencen
    // publicar en board x : "bug x se vence"

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

    const getBugsQuery = {
        text: `
            SELECT *
            FROM bugs
            WHERE due_by IS NOT NULL AND due_by < CURRENT_TIMESTAMP;
        `,
    };

    const client = new Client(dbConfig);
    let bugs;

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the getBugs query...');
        const result = await client.query(getBugsQuery);
        console.log('getBugs query executed successfully.');

        bugs = result.rows;

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');


    } catch (error) {
        console.error('Error fetching bugs:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    const snsClient = new SNSClient({});

    bugs.forEach(bug => {
        //Publish message to topic with attribute for filter
        try {
            const message = {
                TopicArn: process.env.SNS_HOST,
                Message:'Bug number ' + bug.bug_id + ' is expired',
                MessageAttributes: {
                    boardId: {
                        DataType: 'Number',
                        StringValue: bug.board_id
                    },
                }
            };
            const publishResponse = snsClient.send(new PublishCommand(message)); //removed await            
        } catch (error) {
            console.error('Error Publishing:', error);
            response.statusCode = 500;
            response.body = 'Internal Server Error';
        }
    });

    return response;
};
