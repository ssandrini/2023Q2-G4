import React from 'react';
import Board from 'react-ui-kanban';

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

function BoardView() {
  return <><Board data={data} /></>;
}

export default BoardView;
