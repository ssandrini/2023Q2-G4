// boardService.js

import { instance } from './config';


// Not tested
async function createBoard(title, created_by) {
  try {
    console.log(created_by)
    const response = await instance.post('/boards',{"created_by": created_by, "name": title });
    return response.data;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
}

// Me tira 500 
// console.log(addUserToBoard("gonzabeade+test@gmail.com", 6))
async function addUserToBoard(username, boardId) {
  try {
    const apiUrl = `/boards/${boardId}`;
    
    // Define the request body
    const requestBody = {
      username: username,
    };

    // Make the PATCH request with the provided username and boardId
    const response = await instance.patch(apiUrl, requestBody);

    // If needed, you can extract data from the response
    const updatedBoard = response.data;
    console.log(updatedBoard);

    // Return the updated board or any other relevant data
    return updatedBoard;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error adding user to board:', error.message);
    throw error;
  }
}


// OK
async function getBoardsByUsername(username) {
  try {
    const apiUrl = '/boards';
    const response = await instance.get(apiUrl, {
      params: { username: username },
    });
    const userBoards = response.data;
    console.log(userBoards)
    return userBoards;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error fetching user boards:', error.message);
    throw error;
  }
}

async function getBoardById(boardId) {
  const mockData = { id: boardId, title: `Board ${boardId}`, description: `Description for Board ${boardId}` };
  const board = mockData;
  return board;
}

export { createBoard, addUserToBoard, getBoardsByUsername, getBoardById };
