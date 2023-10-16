exports.handler = async (event, context) => {
    const boardId = event.pathParameters.boardId;
  
    // Mock data for a new bug in the specified board
    const bug = {
      id: 'bug-789',
      boardId: boardId,
      title: 'Bug in Feature X',
      description: 'Bug description goes here.',
      createdAt: new Date().toISOString(),
    };
  
    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify(bug),
    };
  };
  