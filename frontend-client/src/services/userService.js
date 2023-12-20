// userService.js

import { instance } from './config';

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
async function createUserData({ email, sub, role }) {
  try {
    const apiUrl = '/users';

    // Define the request body
    const requestBody = {
      username: email,
      role: role,
      cognitoSub: sub,
      // Add other properties if needed (e.g., name)
    };

    // Make the POST request to create a new user
    const response = await instance.post(apiUrl, requestBody);

    // If needed, you can extract data from the response
    const createdUser = response.data;
    // Return the created user or any other relevant data
    return createdUser;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.log("ERROR DETECTED", error)
    throw error;
  }
}

function getCurrentUserData() {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found in localStorage.');
      return null;
    }

    // Decode the JWT token
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    const payloadData = JSON.parse(decodedPayload);

    // Extract user information
    const userData = {
      familyName: payloadData.family_name,
      givenName: payloadData.given_name,
      nickname: payloadData.nickname,
      email: payloadData.email,
      cognitoSub: payloadData['cognito:username'], 
      idToken: token, 
      fakeRole: payloadData.address?.formatted === 'on' ? 'manager' : 'developer', 
      role: payloadData['cognito:groups']?.length > 0 ? payloadData['cognito:groups'][0] : null, 
      isManager: payloadData['cognito:groups']?.includes["MANAGER"]
    };

    
    return userData;
  } catch (error) {
    console.error('Error decoding and extracting user data:', error);
    return null;
  }
}

export { getUserBySub, getUserByUsername, createUserData, getCurrentUserData};
