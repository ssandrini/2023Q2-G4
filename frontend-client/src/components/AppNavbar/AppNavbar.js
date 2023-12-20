import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TableOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser(); // Check user when component mounts

    // Subscribe to Hub events for authentication changes
    const authListener = Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signIn' || payload.event === 'signOut') {
        checkUser(); // Update user when authentication status changes
      }
    });

    return () => {
      authListener(); // Unsubscribe when component unmounts
    };
  }, []);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUser(authUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigate('/login');
      // localStorage.removeItem("token");
      // Additional cleanup or redirection logic if needed
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
        <Logo />
        {user && (
          <>
            <Menu.Item key="/me" icon={<UserOutlined />}>
              <Link to="/me">User Data</Link>
            </Menu.Item>
            <Menu.Item key="/boards" icon={<TableOutlined />}>
              <Link to="/boards">My Boogie Boards</Link>
            </Menu.Item>
            <Menu.Item key="/signout" icon={<LogoutOutlined />} onClick={handleSignOut}>
              Sign Out
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
}

export default AppNavbar;
