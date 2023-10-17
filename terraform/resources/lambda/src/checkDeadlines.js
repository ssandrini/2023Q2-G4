exports.handler = async (event, context) => {

    console.log("Deadlines checked!")

    // Return a successful response
    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  };
  