import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { getBoardsByUsername } from '../../services/boardService';

// New component for the details card
const AllBoardsHeaderCard = () => {

  // Placeholder content, replace with actual details fetching logic
  const details = {
    description: 'This is the detailed description of the board.',
    createdBy: 'John Doe',
    // Add more details as needed
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px' }}>
      <h2>My Boards</h2>
      <Divider style={{ margin: '16px 0' }} />
      {/* Add more details as needed */}
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


