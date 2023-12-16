// boardService.js

import { API_URL } from './config';

async function fetchBoardData(boardId) {
  const response = await fetch(`${API_URL}/boards/${boardId}`);
  const data = await response.json();
  return data;
}

async function getBoardsByUsername(username) {
  // Mock data, replace with actual fetch logic
  const mockData = [
    { id: '1', title: 'Board 1', description: 'Description for Board 1' },
    { id: '2', title: 'Board 2', description: 'Description for Board 2' },
  ];

  // Assuming there is an API endpoint for user-specific boards
  // const response = await fetch(`${API_URL}/boards?username=${username}`);
  // const data = await response.json();
  // Replace the next line with actual logic to filter boards by username
  const userBoards = mockData; // Replace this line with actual filtering

  return userBoards;
}

async function getBoardById(boardId) {
  // Mock data, replace with actual fetch logic
  const mockData = { id: boardId, title: `Board ${boardId}`, description: `Description for Board ${boardId} testing now ` };

  // Assuming there is an API endpoint for fetching a board by ID
  // const response = await fetch(`${API_URL}/boards/${boardId}`);
  // const data = await response.json();
  // Replace the next line with actual logic to get board by ID
  const board = mockData; // Replace this line with actual fetching

  return board;
}

export { getBoardsByUsername, getBoardById, fetchBoardData };
