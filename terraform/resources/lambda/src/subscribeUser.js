const { SNSClient, SubscribeCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event, context) => {
    const response = {
        statusCode: 200,
        body: '',
    };

    const snsClient = new SNSClient({});

    try {
        console.log('Subscribing to SNS...');
        const sns_response = await snsClient.send(
            new SubscribeCommand({
                Protocol: "email",
                TopicArn: "arn:aws:sns:us-east-1:477488091332:new-bug",
                Endpoint: "umihura@itba.edu.ar",
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