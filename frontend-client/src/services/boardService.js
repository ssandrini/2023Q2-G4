// boardService.js

import { API_URL } from '../config';

async function fetchBoardData(boardId) {
  const response = await fetch(`${API_URL}/boards/${boardId}`);
  const data = await response.json();
  return data;
}

// Add more service functions as needed

export { fetchBoardData };
