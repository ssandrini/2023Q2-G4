import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TableOutlined, LogoutOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'; 

const { Header } = Layout;

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
          <Link to="/me">User Data</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<TableOutlined />}>
          <Link to="/boards">My Boogie Boards</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />}>
          <Link to="/signout">Sign Out</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}


export default AppNavbar;

