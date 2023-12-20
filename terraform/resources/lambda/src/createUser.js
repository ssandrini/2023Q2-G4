const { Client } = require('pg');
var AWS = require('aws-sdk');

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

    let userData;

    try {
        userData = JSON.parse(event.body);
        console.log(userData);
    } catch (error) {
        console.error('Error extracting user data from the event body:', error);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid request body';
        return response;
    }

    const { username, role, cognitoSub, userPoolId} = userData;

    if (!['MANAGER', 'DEVELOPER'].includes(role)) {
        console.error('Invalid role:', role);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid role. Role must be "MANAGER" or "DEVELOPER"';
        return response;
    }

    var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

    var params = {
      GroupName: role,
      UserPoolId: userPoolId,
      Username: username
    };

    cognitoIdentityServiceProvider.adminAddUserToGroup(params, function(err, data) {
        if (err) {
            console.log("Error connecting with Cognito", err);
            response.statusCode = 500;
            response.body = 'Error connecting with Cognito';
            return response; 
        } 
        else     console.log("Success");
    });

    const createUserQuery = {
        text: `
            INSERT INTO users (username, role, cognito_sub)
            VALUES ($1, $2, $3)
        `,
        values: [username, role, cognitoSub],
    };

    const client = new Client(dbConfig);

    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected to the database.');

        console.log('Executing the createUser query...');
        await client.query(createUserQuery);
        console.log('createUser query executed successfully.');

        console.log('Closing the database connection...');
        await client.end();
        console.log('Database connection closed.');

        response.body = 'User created';
    } catch (error) {
        console.error('Error creating user:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
        return response;
    }

    return response;
};