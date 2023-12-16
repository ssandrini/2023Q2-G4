import React from 'react';
import { useParams } from 'react-router-dom';
import Board from 'react-ui-kanban';
import { Divider } from 'antd';


const data = {
  lanes: [
    {
      id: 'lane1',
      title: 'To Do',
      label: '2/2',
      cards: [
        { id: 'Card1', title: 'Task 1', description: 'Description for Task 1', label: '30 mins' },
        { id: 'Card2', title: 'Task 2', description: 'Description for Task 2', label: '45 mins' },
      ],
    },
    {
      id: 'lane2',
      title: 'In Progress',
      label: '0/0',
      cards: [],
    },
    {
      id: 'lane3',
      title: 'Done',
      label: '0/0',
      cards: [],
    },
  ],
};

// New component for the details card
const BoardDetailsCard = () => {

  const { boardId } = useParams();

  // Placeholder content, replace with actual details fetching logic
  const details = {
    description: 'This is the detailed description of the board.',
    createdBy: 'John Doe',
    // Add more details as needed
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px'}}>
      <h2>Board {boardId}</h2>
      <Divider style={{ margin: '16px 0' }} /> 
      <p>Description: {details.description}</p>
      <p>Created By: {details.createdBy}</p>
      {/* Add more details as needed */}
    </div>
  );
};

function BoardView() {

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BoardDetailsCard /> {/* Render the details card */}
      <Board data={data} />
    </div>
  );
}

export default BoardView;
