const { Client } = require('pg');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event, context) => {
    // TODO.
    
    const response = {
        statusCode: 200,
        body: '',
    };

    return response;
};
