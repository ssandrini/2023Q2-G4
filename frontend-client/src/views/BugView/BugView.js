import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography, Modal, Image } from 'antd';

const { Title } = Typography;

const BugDetailsCard = () => {
  const { bugId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const bugDetails = {
    title: 'Sample Bug',
    description: 'This is the detailed description of the bug.',
    reportedBy: 'John Doe',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoc6151zkPM7iSmvSv5EsyY0emPp4fas1WdA&usqp=CAU', // Replace with the actual image URL
    // Add more details as needed
  };

  const showImageModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>Bug {bugId}</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p>Title: {bugDetails.title}</p>
      <p>Description: {bugDetails.description}</p>
      <p>Reported By: {bugDetails.reportedBy}</p>
      {/* Add more details as needed */}
      
      {/* Image preview that opens in a modal */}
      <div style={{ cursor: 'pointer' }} onClick={showImageModal}>
        <Image
          width={100} // Adjust the width as needed
          height={100} // Adjust the height as needed
          src={bugDetails.imageUrl}
          alt="Bug Image"
        />
      </div>


    </div>
  );
};

function BugView() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#3179ba' }}>
      <BugDetailsCard />
      {/* Add additional components or data fetching for bug-related content */}
    </div>
  );
}

export default BugView;
