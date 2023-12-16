// userService.js

import { API_URL } from '../config';

async function fetchUserData(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`);
  const data = await response.json();
  return data;
}

// Add more service functions as needed

export { fetchUserData };
