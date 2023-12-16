import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Divider, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getBoardsByUsername } from '../../services/boardService';
import { Auth } from 'aws-amplify';
import { PlusOutlined } from '@ant-design/icons';

// Placeholder function to check if the user is a manager
const isManager = (user) => {
  // Replace this logic with your actual role-checking mechanism
  return user && user.attributes['custom:role'] === 'manager';
};

const AllBoardsHeaderCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px' }}>
      <h2>My Boards</h2>
      <Divider style={{ margin: '16px 0' }} />
      {/* Add more details as needed */}

      {!isManager(user) && (
        <Button type="primary" style={{ background: '#3179ba' }} icon={<PlusOutlined />}>
          Create Board
        </Button>
      )}
    </div>
  );
};

function MyBoardsView() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Fetch boards when the component mounts
    const username = 'your_username'; // Replace with the actual username or fetch it from your authentication state
    getBoardsByUsername(username).then((data) => {
      setBoards(data);
    });
  }, []);

  return (
    <div style={{ background: '#3179ba', padding: '20px', minHeight: '100vh' }}>
      <AllBoardsHeaderCard></AllBoardsHeaderCard>
      <Row gutter={[16, 16]}>
        {boards.map((board) => (
          <Col key={board.id} xs={24} sm={12} md={8} lg={6}>
            <Link to={`/boards/${board.id}`}>
              <Card
                title={board.title}
                style={{ minHeight: '200px', background: '#fff', borderRadius: '8px', padding: '16px' }}
              >
                <p>{board.description}</p>
                {/* Add more details or actions for each board as needed */}
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default MyBoardsView;


