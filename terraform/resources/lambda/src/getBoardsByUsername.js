exports.handler = async (event, context) => {
    // Mock data for boards owned by the user
    const boards = [
      {
        id: 'board-123',
        name: 'Project Board',
        owner: 'user123',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'board-456',
        name: 'Personal Tasks',
        owner: 'user123',
        createdAt: new Date().toISOString(),
      },
    ];
  
    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify(boards),
    };
};
  