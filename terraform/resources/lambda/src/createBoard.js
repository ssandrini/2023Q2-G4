exports.handler = async (event, context) => {
    // Mock data for a new board
    const board = {
      id: 'board-123',
      name: 'Project Board',
      owner: 'user123',
      createdAt: new Date().toISOString(),
    };
  
    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify(board),
    };
  };
  