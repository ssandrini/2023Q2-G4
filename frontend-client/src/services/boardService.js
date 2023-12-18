// boardService.js

import { API_URL } from './config';

async function createBoard({ title, description }) {
  const mockData = { id: '3', title, description };
  const newBoard = mockData;
  return newBoard;
}

async function addUserToBoard(username, boardId) {
  const mockData = { username, boardId };
  const updatedBoard = mockData;
  return updatedBoard;
}

async function getBoardsByUsername(username) {
  const mockData = [
    { id: '1', title: 'Board 1', description: 'Description for Board 1' },
    { id: '2', title: 'Board 2', description: 'Description for Board 2' },
  ];
  const userBoards = mockData;
  return userBoards;
}

async function getBoardById(boardId) {
  const mockData = { id: boardId, title: `Board ${boardId}`, description: `Description for Board ${boardId}` };
  const board = mockData;
  return board;
}

export { createBoard, addUserToBoard, getBoardsByUsername, getBoardById };
