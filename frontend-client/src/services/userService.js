// userService.js

import { API_URL } from './config';

async function getUserBySub(cognitoSub) {
  // Mock data for a generic user, replace with actual fetch logic
  const mockUserData = {
    sub: cognitoSub,
    username: 'BeadeGonzalo',
    email: 'john.doe@example.com',
    name: 'Gonzalo'
    // Add more user details as needed
  };

  // Assuming there is an API endpoint for fetching user data by cognitoSub
  // const response = await fetch(`${API_URL}/users?cognitoSub=${cognitoSub}`);
  // const data = await response.json();
  // Replace the next line with actual logic to get user data by cognitoSub
  const userData = mockUserData; // Replace this line with actual fetching

  return userData;
}

export { getUserBySub };
