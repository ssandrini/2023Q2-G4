import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from 'react-ui-kanban';
import { Divider } from 'antd';
import { getBugsByBoardId, changeBugProgress} from '../../services/bugService';
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

function bugCollectionToLaneSchema(bugs) {
  // Create initial data structure
  const kanbanData = {
    lanes: [
      {
        id: "ICEBOX",
        title: 'Icebox',
        label: '0/0',
        cards: []
      },
      {
        id: "TODO",
        title: 'To Do',
        label: '0/0',
        cards: []
      },
      {
        id: "DOING",
        title: 'Doing',
        label: '0/0',
        cards: []
      },
      {
        id: "DONE",
        title: 'Done',
        label: '0/0',
        cards: []
      }
    ]
  };

  // Iterate through bugs and add them to the appropriate lane based on progress
  bugs.forEach((bug, index) => {
    const card = {
      id: bug.id,
      title: bug.title,
      description: bug.description,
      label: bug.label || '',
      draggable: true,
      metadata: {
        bugId: bug.bugId,
        progress: bug.progress
      }
    };

    // Determine the lane index based on the progress
    let laneIndex;
    switch (bug.progress) {
      case 'ICEBOX':
        laneIndex = 0;
        break;
      case 'TODO':
        laneIndex = 1;
        break;
      case 'DOING':
        laneIndex = 2;
        break;
      case 'DONE':
        laneIndex = 3;
        break;
      default:
        // Set a default lane (you can customize this based on your needs)
        laneIndex = 0;
    }

    // Add the card to the appropriate lane
    kanbanData.lanes[laneIndex].cards.push(card);
  });

  // Update the labels for each lane
  kanbanData.lanes.forEach((lane, index) => {
    lane.label = `${kanbanData.lanes[index].cards.length}/${kanbanData.lanes[index].cards.length}`;
  });

  return kanbanData;
}


function BoardView() {
  const navigate = useNavigate();
  const { boardId } = useParams();

  // State for holding bug data
  const [boardData, setBoardData] = useState(bugCollectionToLaneSchema([]))
  const [bugs, setBugs] = useState(bugCollectionToLaneSchema([]))


  useEffect(() => {
    // Fetch bug data when the component mounts
    getBugsByBoardId(boardId).then((bugs) => {
      const bugCards = bugs.map((bug) => ({
        id: bug.id,
        title: bug.title,
        description: bug.description,
        label: bug.label,
        bugId: bug.id,
        progress: bug.progress
      }));

      // Set the bug cards to the 'To Do' lane
      setBugs(bugCards)
      setBoardData(bugCollectionToLaneSchema(bugCards));
    });
  }, [boardId]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BoardDetailsCard /> {/* Render the details card */}
      <Board
      onCardMoveAcrossLanes = {(fromLaneId, toLaneId, bugId, index) => {
        console.log(fromLaneId, toLaneId, bugId, index); 
        changeBugProgress(bugId, toLaneId)
      }}
      onCardDelete={(cardId, laneId) => {console.log("POOF", cardId)}}
        onCardClick={(cardId, metadata, laneId) => {
          // Redirect to /boards/:boardId/bugs/:bugId when a card is clicked
          const bugId = bugs.find((bug) => bug.id === cardId)?.bugId;
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