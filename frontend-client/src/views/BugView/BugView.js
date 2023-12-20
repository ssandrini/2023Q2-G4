import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Typography, Modal, Image } from 'antd';
import { getBugsByBoardId } from '../../services/bugService';

const { Title } = Typography;

const BugDetailsCard = () => {
  const { bugId, boardId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bugDetails, setBugDetails] = useState({})

  useEffect(
    () => {
      getBugsByBoardId(boardId).then(bugs => {const bug = bugs.bugs.find(t => `${t.bug_id}` === bugId); setBugDetails({
        title: bug.name, 
        description: bug.description, 
        created_at: bug.created_at, 
        deadline: bug.due_by
      })}) ;
    }, [])

  const showImageModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
     bugDetails && 
    <div style={{ background: '#fff', borderRadius: '8px', padding: '25px', marginBottom: '16px', marginLeft: '10px' }}>
      <Title level={2}>Bug {bugId}</Title>
      <Divider style={{ margin: '16px 0' }} />
      <p><b>Title</b>: {bugDetails.title}</p>
      <p><b>Description</b>: {bugDetails.description}</p>
      <p><b>Created at</b>: {bugDetails.created_at}</p>
      <p><b>Deadline</b>: {bugDetails.deadline}</p>
      {/* Add more details as needed */}
      
      {/* Image preview that opens in a modal */}
      {/* <div style={{ cursor: 'pointer' }} onClick={showImageModal}>
        <Image
          width={100} // Adjust the width as needed
          height={100} // Adjust the height as needed
          src={bugDetails.imageUrl}
          alt="Bug Image"
        />
      </div> */}


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
