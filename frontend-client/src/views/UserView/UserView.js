import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from 'antd';
import { getCurrentUserData} from '../../services/userService';

const { Title } = Typography;

// New component for the user details
const UserDetailsCard = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(getCurrentUserData())
  }, []);

  if (!userDetails) {
    return null; // You can render a loading spinner or message here while data is being fetched
  }

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>User details</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p style={{marginBottom: '5px' }}>
        <b>Full name</b>: {userDetails.familyName}, {userDetails.givenName}
      </p>
      <p style={{ marginBottom: '5px' }}>
        <b>Nickname</b>: {userDetails.nickname}
      </p>
      <p style={{ marginBottom: '5px' }}>
        <b>Email</b>: {userDetails.email}
      </p>
      <p style={{ marginBottom: '5px', color: '#aaa' }}>
        <b>Cognito Sub</b> <span style={{ fontSize: '80%' }}>[DEV ONLY]</span>: {userDetails.cognitoSub}
      </p>
      <p style={{ marginBottom: '5px', color: '#aaa' }}>
        <b>Role: </b> <span style={{ fontSize: '80%' }}>[DEV ONLY]</span>: {userDetails.role}
      </p>
      <p style={{ marginBottom: '5px', color: '#aaa' } }>
        <b>Id Token</b> <span style={{ fontSize: '80%' }}>[DEV ONLY]</span>: {userDetails.idToken}
      </p>
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

