import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from 'react-ui-kanban';
import { Divider, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { getBugsByBoardId, updateBug, createBug } from '../../services/bugService';
import { getBoardById } from '../../services/boardService';
import { PlusOutlined, UserAddOutlined} from '@ant-design/icons';
const { Option } = Select;  // Destructure the Option component


const isManager = (user) => {
  return !false; // user && user.attributes['custom:role'] === 'manager';
};


const BoardDetailsCard = ({ showFileBugModal }) => {
  const { boardId } = useParams();

  const [boardDetails, setBoardDetails] = useState({
    description: 'This is the detailed description of the board.',
    createdBy: 'John Doe',
  });

  useEffect(() => {
    getBoardById(boardId).then((board) => {
      setBoardDetails({
        description: board.description,
        createdBy: board.createdBy,
      });
    });
  }, [boardId]);

  const showAddParticipantModal = () => {
    // Implement the logic to show the modal for adding a participant
    console.log('Add Participant modal logic');
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <h2>Board {boardId}</h2>
      <Divider style={{ margin: '16px 0' }} />
      <p>Description: {boardDetails.description}</p>
      <p>Created By: {boardDetails.createdBy}</p>
    
      <Divider style={{ margin: '16px 0' }} />
      {!isManager() && (
        <Button
          type="primary"
          style={{ background: '#3179ba' }}
          icon={<PlusOutlined />}
          onClick={showFileBugModal}
        >
          File bug
        </Button>
      )}

      {/* Button for adding a participant (visible only for managers) */}
      {isManager() && (
        <Button
          type="primary"
          style={{ background: '#3179ba', marginLeft: '10px' }}
          icon={<UserAddOutlined />}
          onClick={showAddParticipantModal}
        >
          Add participant
        </Button>
      )}
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
  const [boardData, setBoardData] = useState(bugCollectionToLaneSchema([]));
  const [bugs, setBugs] = useState(bugCollectionToLaneSchema([]));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showFileBugModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    // Handle the form submission (create new bug)
    console.log('Received values:', values);
    // Implement the logic to create a new bug, e.g., make an API call
    // After creating the bug, you may want to refresh the list of bugs
    setIsModalVisible(false);
  };

  useEffect(() => {
    getBugsByBoardId(boardId).then((bugs) => {
      const bugCards = bugs.map((bug) => ({
        id: bug.id,
        title: bug.title,
        description: bug.description,
        label: bug.label,
        bugId: bug.id,
        progress: bug.progress,
      }));

      setBugs(bugCards);
      setBoardData(bugCollectionToLaneSchema(bugCards));
    });
  }, [boardId]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BoardDetailsCard showFileBugModal={showFileBugModal} />
      <Board
        onCardMoveAcrossLanes={(fromLaneId, toLaneId, bugId, index) => {
          // changeBugProgress(bugId, toLaneId);
        }}
        onCardDelete={(cardId, laneId) => {
          console.log('POOF', cardId);
        }}
        onCardClick={(cardId, metadata, laneId) => {
          const bugId = bugs.find((bug) => bug.id === cardId)?.bugId;
          if (bugId) {
            navigate(`/boards/${boardId}/bugs/${bugId}`);
          }
        }}
        data={boardData}
      />

      <Modal title="File Bug" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form name="fileBug" onFinish={onFinish}>
          <Form.Item
            name="bugTitle"
            label="Bug Title"
            rules={[{ required: true, message: 'Please enter the bug title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bugDescription"
            label="Bug Description"
            rules={[{ required: true, message: 'Please enter the bug description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="bugDeadline"
            label="Deadline"
            rules={[{ required: true, message: 'Please select the deadline!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="bugStage"
            label="Initial Stage"
            rules={[{ required: true, message: 'Please select the initial stage!' }]}
          >
            <Select placeholder="Select the initial stage">
              <Option value="Icebox">Icebox</Option>
              <Option value="ToDo">ToDo</Option>
              <Option value="Doing">Doing</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              File Bug
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BoardView;


