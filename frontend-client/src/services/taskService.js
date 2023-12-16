// taskService.js

import { API_URL } from '../config';

async function fetchTaskData(taskId) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`);
  const data = await response.json();
  return data;
}

// Add more service functions as needed

export { fetchTaskData };
