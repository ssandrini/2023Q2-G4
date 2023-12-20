const { Client } = require('pg');
// const { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider"); // ES Modules import

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

    if (!['manager', 'developer'].includes(role)) {
        console.error('Invalid role:', role);
        response.statusCode = 400; // Bad Request
        response.body = 'Invalid role. Role must be "MANAGER" or "DEVELOPER"';
        return response;
    }

    // const input = {
    //   GroupName: role,
    //   UserPoolId: userPoolId,
    //   Username: username
    // };

    // const cognito_client = new CognitoIdentityProviderClient({});
    // const command = new AdminAddUserToGroupCommand(input);
    // const cognito_response = await cognito_client.send(command);
    // console.log(cognito_response)

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

// exports.handler = async (event, context) => {
//     const { request } = event;

//     // Check the value of isManager
//     const isManager = request.userAttributes['custom:isManager'] === 'true';

//     // Assign the user to the appropriate group
//     if (isManager) {
//         request.groupConfiguration = {
//             groupsToOverride: ['MANAGER'],
//             iamRolesToOverride: [],
//             preferredRole: 'MANAGER',
//         };
//     } else {
//         request.groupConfiguration = {
//             groupsToOverride: ['DEVELOPER'],
//             iamRolesToOverride: [],
//             preferredRole: 'DEVELOPER',
//         };
//     }

//     // Return the modified request
//     return event;
// };