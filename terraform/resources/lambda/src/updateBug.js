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

    const { description, due_by, stage, bug_id } = bugData;

    if (!['icebox', 'to-do', 'doing', 'done'].includes(stage)) {
        console.error('Invalid stage:', stage);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid stage. Stage must be "icebox", "to-do", "doing", or "done"';
        return response;
    }

    let updateBugQuery = {
        text: 'UPDATE bugs SET',
        values: [],
    };

    const setClause = [];
    if (description !== undefined) {
        setClause.push(`description = $${updateBugQuery.values.push(description)}`);
    }
    if (due_by !== undefined) {
        setClause.push(`due_by = $${updateBugQuery.values.push(due_by)}`);
    }
    if (stage !== undefined) {
        setClause.push(`stage = $${updateBugQuery.values.push(stage)}`);
    }

    if (setClause.length === 0) {
        response.statusCode = 400;
        response.body = 'No valid fields provided for update';
        return response;
    }

    updateBugQuery.text += ` ${setClause.join(', ')}`;
    updateBugQuery.text += ' WHERE bug_id = $1';
    updateBugQuery.values.unshift(bug_id);

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
        await client.query(updateBugQuery);
        console.log('updateBugQuery query executed successfully.');

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = 'Bug created';
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
            Message: 'Updated bug ' + bug.bug_id + ' from your board!',
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
