// bugService.js

import { instance } from './config';


// Not tested 
async function getBugsByBoardId(boardId) {
  try {
    const apiUrl = `/boards/${boardId}/bugs`;
    
    // Make the GET request to retrieve bugs for the specified board
    const response = await instance.get(apiUrl);

    // Extract the data from the response
    const bugs = response.data;
    console.log(bugs);

    // Return the bugs or any other relevant data
    return bugs;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error fetching bugs:', error.message);
    throw error;
  }
}

// Not implemented 
async function getBugById(bugId) {
  const mockData = {
    id: bugId,
    title: `Bug ${bugId}`,
    description: `Description for Bug ${bugId}`,
    label: '30 mins',
  };
  const bug = mockData;
  return bug;
}

// Not tested 
async function createBug(boardId, { name, description, due_by, stage }) {
  try {
    const apiUrl = `/boards/${boardId}/bugs`;

    // Define the request body with destructured bug data for creation
    const requestBody = {
      name,
      description,
      due_by,
      stage,
      // Add other properties if needed
    };

    // Make the POST request to create a new bug in the board
    const response = await instance.post(apiUrl, requestBody);

    // If needed, you can extract data from the response
    const createdBug = response.data;
    console.log(createdBug);

    // Return the created bug or any other relevant data
    return createdBug;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error creating bug:', error.message);
    throw error;
  }
}

// Not tested
async function updateBug(boardId, bugId, { description, due_by, stage }) {
  try {
    const apiUrl = `/boards/${boardId}/bugs/${bugId}`;
    
    // Define the request body with the destructured bug data to update
    const requestBody = {
      description,
      due_by,
      stage,
      // Add other properties if needed
    };

    // Make the PATCH request to update the bug
    const response = await instance.patch(apiUrl, requestBody);

    // If needed, you can extract data from the response
    const updatedBug = response.data;
    console.log(updatedBug);

    // Return the updated bug or any other relevant data
    return updatedBug;
  } catch (error) {
    // Handle errors, e.g., log the error or throw an exception
    console.error('Error updating bug:', error.message);
    throw error;
  }
}


export { getBugsByBoardId, getBugById, createBug, updateBug };
