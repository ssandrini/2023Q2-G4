// userService.js

import { API_URL } from './config';

async function getUserBySub(cognitoSub) {
  const mockUserData = {
    sub: cognitoSub,
    username: 'BeadeGonzalo',
    email: 'john.doe@example.com',
    name: 'Gonzalo',
    cognitoSub: cognitoSub,
    token: localStorage.getItem('token'),
  };
  const userData = mockUserData;
  return userData;
}

async function getUserByUsername(username) {
  const mockUserData = {
    sub: 'mockSub',
    username: username,
    email: `${username}@example.com`,
    name: 'John Doe',
  };

  const userData = mockUserData;
  return userData;
}

async function createUserData({ username, email, name }) {
  const mockUserData = {
    sub: 'newMockSub',
    username,
    email,
    name,
  };

  const newUser = mockUserData;
  return newUser;
}

export { getUserBySub, getUserByUsername, createUserData };
