import React from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from 'antd';

const { Title } = Typography;

// New component for the user details
const UserDetailsCard = () => {
  const { userId } = useParams();

  // Placeholder content, replace with actual details fetching logic
  const userDetails = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    // Add more details as needed
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>User {userId}</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p>Name: {userDetails.name}</p>
      <p>Email: {userDetails.email}</p>
      {/* Add more details as needed */}
    </div>
  );
};

function UserView() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <UserDetailsCard /> {/* Render the user details card */}
      {/* Add additional components or data fetching for user-related content */}
    </div>
  );
}

export default UserView;
