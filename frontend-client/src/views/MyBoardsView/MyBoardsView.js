import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Divider, Button, Modal, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { getBoardsByUsername, createBoard} from '../../services/boardService';
import { getCurrentUserData } from '../../services/userService';

import { Auth } from 'aws-amplify';
import { PlusOutlined } from '@ant-design/icons';

const isManager = (user) => {
  return true; // user && user.attributes['custom:role'] === 'manager';
};

const AllBoardsHeaderCard = ({ showCreateBoardModal }) => {
  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px' }}>
      <h2>My Boards</h2>
      <Divider style={{ margin: '16px 0' }} />

      {isManager() && (
        <Button
          type="primary"
          style={{ background: '#3179ba' }}
          icon={<PlusOutlined />}
          onClick={showCreateBoardModal}
        >
          Create Board
        </Button>
      )}
    </div>
  );
};

function MyBoardsView() {
  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showCreateBoardModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    // Handle the form submission (create new board)
    console.log('Received values:', values);
    // Implement the logic to create a new board, e.g., make an API call
    // After creating the board, you may want to refresh the list of boards
    const newBoard = createBoard(values.boardName, getCurrentUserData().email).then( (newBoard) => {
    setIsModalVisible(false);
    console.log("NEW", newBoard)
    setBoards(prevBoards => [...prevBoards, {name: values.boardName, board_id: newBoard.board_id}])
  });
  };

  useEffect(() => {
    const username = getCurrentUserData().email;
    getBoardsByUsername(username).then((data) => {
      setBoards(data.boards);
    });
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <div style={{ background: '#3179ba', padding: '20px', minHeight: '100vh' }}>
      <AllBoardsHeaderCard showCreateBoardModal={showCreateBoardModal} />
      <Row gutter={[16, 16]}>
        {boards.map((board) => (
          <Col key={board.board_id} xs={24} sm={12} md={8} lg={6}>
            <Link to={`/boards/${board.board_id}`}>
              <Card
                title={board.name}
                style={{ minHeight: '200px', background: '#fff', borderRadius: '8px', padding: '16px' }}
              >
                <p>{board.description}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Modal
        title="Create Board"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="createBoard" onFinish={onFinish}>
          <Form.Item
            name="boardName"
            label="Board Name"
            rules={[{ required: true, message: 'Please enter the board name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="boardDescription"
            label="Board Description"
            rules={[{ required: true, message: 'Please enter the board description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MyBoardsView;

