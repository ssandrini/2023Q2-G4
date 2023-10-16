exports.handler = async (event, context) => {

    const boardId = event.pathParameters.boardId;
  
    // Mock data for bugs in the specified board
    const bugs = [
      {
        id: 'bug-789',
        boardId: boardId,
        title: 'Bug in Feature X',
        description: 'Bug description goes here.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bug-101',
        boardId: boardId,
        title: 'Critical Bug',
        description: 'Another bug description.',
        createdAt: new Date().toISOString(),
      },
    ];
  
    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify(bugs),
    };
  };
  