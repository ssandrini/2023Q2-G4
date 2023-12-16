import React from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from 'antd';

const { Title } = Typography;

// New component for the bug details
const BugDetailsCard = () => {
  const { bugId } = useParams();

  // Placeholder content, replace with actual details fetching logic
  const bugDetails = {
    title: 'Sample Bug',
    description: 'This is the detailed description of the bug.',
    reportedBy: 'John Doe',
    // Add more details as needed
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>Bug {bugId}</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p>Title: {bugDetails.title}</p>
      <p>Description: {bugDetails.description}</p>
      <p>Reported By: {bugDetails.reportedBy}</p>
      {/* Add more details as needed */}
    </div>
  );
};

function BugView() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BugDetailsCard /> {/* Render the bug details card */}
      {/* Add additional components or data fetching for bug-related content */}
    </div>
  );
}

export default BugView;
