import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { UserOutlined, TableOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

// Custom Logo component
const Logo = () => {
  return (
    <img
      src={require('../../assets/logo.png')} // Adjust the path based on your project structure
      alt="BoogieBoards Logo"
      style={{ height: '60px', marginRight: '50px' }}
    />
  );
};

function AppNavbar() {
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Logo />
        <Menu.Item key="1" icon={<UserOutlined />}>
          User Data
        </Menu.Item>
        <Menu.Item key="2" icon={<TableOutlined />}>
          My Boogie Boards
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />}>
          Sign Out
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default AppNavbar;

