import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from 'antd';
import { getUserBySub } from '../../services/userService';

const { Title } = Typography;

// New component for the user details
const UserDetailsCard = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {

    const sub = localStorage.getItem("cognitoSub")
    // Fetch user data when the component mounts
    getUserBySub(sub).then((data) => {
      setUserDetails(data);
    });
  }, [userId]);

  if (!userDetails) {
    return null; // You can render a loading spinner or message here while data is being fetched
  }

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>User {userId}</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p>Name: {userDetails.name}</p>
      <p>Username: {userDetails.username}</p>
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

