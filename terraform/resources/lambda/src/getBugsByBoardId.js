//js lambda code

// Use require syntax for modules (CommonJS) since it's a JavaScript file
const { Client } = require('pg');


console.log("antes");

exports.handler = async (event, context) => {
    // RDS connection details
    const dbConfig = {
        user: 'Leandro',
        host: "my-rds-proxy.proxy-cg9gvpc0qjej.us-east-1.rds.amazonaws.com",
        database: 'primarydb',
        password: 'LeandroEsUnCapo123',
        port: 5432,
    };

    // Lambda response object
    const response = {
        statusCode: 200,
        body: '',
    };

    // SQL command to create a table
    const getBugsQuery = `
      SELECT *
      FROM bugs
      WHERE board_id = 1;
    `;


    const client = new Client(dbConfig);

    try {
        // Connect to the database
        await client.connect();

        // Execute the CREATE TABLE query
        const result = await client.query(getBugsQuery);

        // Close the database connection
        await client.end();

        response.body = JSON.stringify(result.rows);
    } catch (error) {
        // Handle errors
        console.error('Error creating table:', error);
        response.statusCode = 500;
        response.body = 'Internal Server Error';
    }

    return response;
};

console.log("desp");