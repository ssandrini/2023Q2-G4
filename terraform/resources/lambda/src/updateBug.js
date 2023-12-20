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

    let bug_id;
    let board_id;
    const pathMatch = event.path.match(/\/boards\/(\d+)\/bugs\/(\d+)/);

    console.log(pathMatch);

    if (pathMatch && pathMatch[1] && pathMatch[2]) {
        bug_id = parseInt(pathMatch[2], 10);
        board_id = parseInt(pathMatch[1], 10);
    } else {
        // Handle the case where the URL doesn't match the expected pattern
        response.statusCode = 400;
        response.body = 'Invalid URL format';
        return response;
    }
    
    console.log("asdasdasd");
    console.log(bug_id);

    if(bugData == undefined){
        response.statusCode = 400; // Bad Request
        response.body = 'Body must contain data';
        return response;
    }

    const { description, due_by, stage } = bugData;

    if (!['icebox', 'to-do', 'doing', 'done'].includes(stage)) {
        console.error('Invalid stage:', stage);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid stage. Stage must be "icebox", "to-do", "doing", or "done"';
        return response;
    }

    let updateBugQuery1 = undefined;
    let updateBugQuery2 = undefined;
    let updateBugQuery3 = undefined;

    if (description !== undefined) {
        updateBugQuery1 = {
            text: `
                UPDATE bugs
                SET
                    description = $1
                WHERE
                    bug_id = $2    
            `,
            values: [description, bug_id],
        };
    }
    if (due_by !== undefined) {
        updateBugQuery2 = {
            text: `
                UPDATE bugs
                SET
                    due_by = $1
                WHERE
                    bug_id = $2    
            `,
            values: [due_by, bug_id],
        };
    }
    if (stage !== undefined) {
        updateBugQuery3 = {
            text: `
                UPDATE bugs
                SET
                    stage = $1
                WHERE
                    bug_id = $2    
            `,
            values: [stage, bug_id],
        };
    }
    console.log("1111111");
    console.log(description);
    console.log(due_by);
    console.log(stage);
    
    console.log(updateBugQuery1);
    console.log(updateBugQuery2);
    console.log(updateBugQuery3);

    // end query:
    // const updateBugQuery = {
    //     text: `
    //         UPDATE bugs
    //         SET
    //             description = $1,
    //             due_by = $2,
    //             stage = $3
    //         WHERE
    //             bug_id = $4;    
    //     `,
    //     values: [description, due_by, stage, bug_id],
    // };


    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the updateBugQuery query...');
        if(updateBugQuery1 != undefined) {
            await client.query(updateBugQuery1);
            console.log('updateBugQuery1 query executed successfully.');
        }
        if(updateBugQuery2 != undefined) {
            await client.query(updateBugQuery2);
            console.log('updateBugQuery2 query executed successfully.');
        }
        if(updateBugQuery3 != undefined) {
            await client.query(updateBugQuery3);
            console.log('updateBugQuery3 query executed successfully.');
        }

        // await client.query(updateBugQuery);
        console.log('updateBugQuery query executed successfully.');

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = 'Bug updated';
    } catch (error) {
        console.error('Error updating bug:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    //Publish message to topic with attribute for filter
    const snsClient = new SNSClient({});

    try {
        const message = {
            TopicArn: process.env.SNS_HOST,
            Message: 'There was an update to bug ' + bug_id + ' from board ' + board_id,
            MessageAttributes: {
                boardId: {
                    DataType: 'Number',
                    StringValue: board_id
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
