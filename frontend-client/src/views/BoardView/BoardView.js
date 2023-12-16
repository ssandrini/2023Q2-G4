import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from 'react-ui-kanban';
import { Divider } from 'antd';
import { getBugsByBoardId} from '../../services/bugService';
import { getBoardById} from '../../services/boardService';


// New component for the details card
const BoardDetailsCard = () => {
  const { boardId } = useParams();

  // State for holding board details
  const [boardDetails, setBoardDetails] = useState({
    description: 'This is the detailed description of the board.',
    createdBy: 'John Doe',
    // Add more details as needed
  });

  useEffect(() => {
    // Fetch board details when the component mounts
    getBoardById(boardId).then((board) => {
      setBoardDetails({
        description: board.description,
        createdBy: board.createdBy,
        // Add more details as needed
      });
    });
  }, [boardId]);

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <h2>Board {boardId}</h2>
      <Divider style={{ margin: '16px 0' }} />
      <p>Description: {boardDetails.description}</p>
      <p>Created By: {boardDetails.createdBy}</p>
      {/* Add more details as needed */}
    </div>
  );
};

function BoardView() {
  const navigate = useNavigate();
  const { boardId } = useParams();

  // State for holding bug data
  const [boardData, setBoardData] = useState({
    lanes: [
      {
        id: 'lane1',
        title: 'To Do',
        label: '2/2',
        cards: [],
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
  });

  useEffect(() => {
    // Fetch bug data when the component mounts
    getBugsByBoardId(boardId).then((bugs) => {
      const bugCards = bugs.map((bug) => ({
        id: bug.id,
        title: bug.title,
        description: bug.description,
        label: bug.label,
        bugId: bug.id,
      }));

      // Set the bug cards to the 'To Do' lane
      setBoardData((prevData) => ({
        ...prevData,
        lanes: [
          {
            ...prevData.lanes[0],
            cards: bugCards,
          },
          ...prevData.lanes.slice(1),
        ],
      }));
    });
  }, [boardId]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BoardDetailsCard /> {/* Render the details card */}
      <Board
        onCardClick={(cardId, metadata, laneId) => {
          // Redirect to /boards/:boardId/bugs/:bugId when a card is clicked
          const bugId = boardData.lanes.find((lane) => lane.id === laneId)?.cards.find((card) => card.id === cardId)?.bugId;
          if (bugId) {
            navigate(`/boards/${boardId}/bugs/${bugId}`);
          }
        }}
        data={boardData}
      />
    </div>
  );
}

export default BoardView;