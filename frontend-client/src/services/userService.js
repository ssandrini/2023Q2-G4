// userService.js

import { API_URL } from './config';

// Not implemented
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


// Not implemented
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

// Not tested
async function createUserData({ username, email, name, role }) {
  try {
    const apiUrl = '/users';

    // Define the request body
    const requestBody = {
      username: username,
      email: email,
      role: role,
      // Add other properties if needed (e.g., name)
    };

    // Make the POST request to create a new user
    const response = await instance.post(apiUrl, requestBody);

    // If needed, you can extract data from the response
    const createdUser = response.data;
    console.log(createdUser);

    // Return the created user or any other relevant data
    return createdUser;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error creating user data:', error.message);
    throw error;
  }
}

export { getUserBySub, getUserByUsername, createUserData };
