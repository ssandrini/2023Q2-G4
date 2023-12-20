import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from 'react-ui-kanban';
import { Divider, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { getBugsByBoardId, updateBug, createBug } from '../../services/bugService';
import { getBoardById, addUserToBoard, getBoardsByUsername } from '../../services/boardService';
import { getCurrentUserData } from '../../services/userService';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
const { Option } = Select;  // Destructure the Option component


const isManager = () => {
  console.log(getCurrentUserData())
  return getCurrentUserData().fakeRole === 'manager'; // user && user.attributes['custom:role'] === 'manager';
};


const BoardDetailsCard = ({ showFileBugModal }) => {
  const { boardId } = useParams();

  const [boardDetails, setBoardDetails] = useState({});

  useEffect(() => {
    const email = getCurrentUserData().email
    getBoardsByUsername(email).then((boards) => {
      let bb = boards.boards.filter(b => `${b.board_id}` === boardId)[0]; 
      setBoardDetails(bb);
    });
  }, []);

  const [isAddParticipantModalVisible, setIsAddParticipantModalVisible] = useState(false);

  const showAddParticipantModal = () => {
    setIsAddParticipantModalVisible(true);
  };

  const handleAddParticipantCancel = () => {
    setIsAddParticipantModalVisible(false);
  };

  const [participantError, setParticipantError] = useState('')
  const onFinish = async (values) => {
    const participantEmail = values["participantEmail"]
    try {

      const response = await addUserToBoard(participantEmail, boardId);

      console.log(response)
      if (response.status === '400') {
        console.error('Failed to add participant:', response.statusText);
        setParticipantError(`${values.details.participantEmail} does not exist`)
      } else {
        setParticipantError('')
      }

      // Close the modal
      setIsAddParticipantModalVisible(false);
    } catch (error) {
      // Handle other errors, e.g., network error
      console.error('Error adding participant:', error.message);
      setParticipantError(`Error adding participant`)

      // You can display a generic error message or take other appropriate actions
    }
  };


  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <h2>Board {boardId}</h2>
      <Divider style={{ margin: '16px 0' }} />
      <p><b>Created at</b>: {boardDetails.created_at?.toString().slice(0, 10)}</p>
      <p><b>Created by</b>: {boardDetails.created_by}</p>

      {
        boardDetails.participants && (
          <div>
            <b>Participants</b>
            {boardDetails.participants.map((participant, index) => (
              <React.Fragment key={index}>
                <p>{participant}</p>
              </React.Fragment>
            ))}
          </div>
        )
      }

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

      {/* Add Participant Modal */}
      <Modal
        title="Add Participant"
        visible={isAddParticipantModalVisible}
        onCancel={handleAddParticipantCancel}
        footer={null}
      >
        <Form name="addParticipantForm" onFinish={onFinish}>
          {/* Add your form fields here, e.g., Input for participant name, etc. */}
          <Form.Item
            name="participantEmail"
            label="Participant Email"
            rules={[{ required: true, message: 'Please enter participant email' }]}
          >
            <Input />
          </Form.Item>

          {/* Additional form fields can be added as needed */}
          <p style={{ color: 'red' }}>{participantError}</p>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Participant
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

function bugCollectionToLaneSchema(bugs) {
  // Create initial data structure
  const kanbanData = {
    lanes: [
      {
        id: "icebox",
        title: 'Icebox',
        label: '0/0',
        cards: []
      },
      {
        id: "to-do",
        title: 'To Do',
        label: '0/0',
        cards: []
      },
      {
        id: "doing",
        title: 'Doing',
        label: '0/0',
        cards: []
      },
      {
        id: "done",
        title: 'Done',
        label: '0/0',
        cards: []
      }
    ]
  };

  // Iterate through bugs and add them to the appropriate lane based on progress
  bugs.forEach((bug, index) => {

    const card = {
      id: bug.bugId,
      title: bug.title,
      description: bug.description,
      label: bug.label || '',
      draggable: true,
      metadata: {
        bugId: bug.bugId,
        stage: bug.stage
      }
    };

    // Determine the lane index based on the progress
    let laneIndex;
    console.log(bug)
    console.log(bug.stage, "HHHHHH")
    switch (bug.stage) {
      case 'icebox':
        laneIndex = 0;
        break;
      case 'to-do':
        laneIndex = 1;
        break;
      case 'doing':
        laneIndex = 2;
        break;
      case 'done':
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

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const onFinish = (values) => {
    // Handle the form submission (create new bug)
    const date = `${formatter.format(values.bugDeadline).replaceAll(". ", "-").slice(0, 10)} 00:00:00`
    console.log({ name: values.bugTitle, description: values.bugDescription, due_by: date, stage: values.bugStage })
    createBug(boardId, { name: values.bugTitle, description: values.bugDescription, due_by: date, stage: values.bugStage }).then(() => { setIsModalVisible(false) })
    // Implement the logic to create a new bug, e.g., make an API call
    // After creating the bug, you may want to refresh the list of bugs
    // setIsModalVisible(false);
  };

  useEffect(() => {
    getBugsByBoardId(boardId).then((bugs) => {
      const bugCards = bugs.bugs.map((bug) => ({
        id: bug.bug_id,
        title: bug.name,
        description: bug.description,
        label: bug.label,
        bugId: bug.bug_id,
        stage: bug.stage,
      }));
      console.log(bugCards, "AAAAAAAAAAAAAAAAA")
      setBugs(bugCards);
      setBoardData(bugCollectionToLaneSchema(bugCards));
    });
  }, [boardId, isModalVisible]);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BoardDetailsCard showFileBugModal={showFileBugModal} />
      <Board
        onCardMoveAcrossLanes={(fromLaneId, toLaneId, bugId, index) => {
          console.log("UNDEFINED????", bugId)
          console.log(toLaneId, bugId)
          console.log(bugs)
          const theBug = bugs.find(bug => bug.bugId === bugId);

          console.log(theBug)
          console.log({ stage: toLaneId, description: theBug.description, due_by: theBug.due_by }, boardId, bugId)
          updateBug(boardId, bugId, { stage: toLaneId, description: theBug.description, due_by: theBug.due_by });
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
              <Option value="icebox">Icebox</Option>
              <Option value="to-do">ToDo</Option>
              <Option value="doing">Doing</Option>
              <Option value="done">Done</Option>
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


