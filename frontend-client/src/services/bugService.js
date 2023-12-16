// bugService.js

import { API_URL } from './config';

async function getBugsByBoardId(boardId) {
  // Mock data, replace with actual fetch logic
  const mockData = [
    { id: 'bug1', title: 'Bug 1', description: 'Description for Bug 1', label: '30 mins', progress: "ICEBOX" },
    { id: 'bug2', title: 'Bug 2', description: 'Description for Bug 2', label: '45 mins', progress: "TODO" },
    { id: 'bug98', title: 'Arreglar kanban board', description: 'Está todo roto', label: '45 mins', progress: "TODO"},
    // Add more bugs as needed
  ];

  // Assuming there is an API endpoint for bugs specific to a board
  // const response = await fetch(`${API_URL}/bugs?boardId=${boardId}`);
  // const data = await response.json();
  // Replace the next line with actual logic to filter bugs by boardId
  const bugs = mockData; // Replace this line with actual filtering

  return bugs;
}

async function getBugById(bugId) {
  // Mock data, replace with actual fetch logic
  const mockData = {
    id: bugId,
    title: `Bug ${bugId}`,
    description: `Description for Bug ${bugId}`,
    label: '30 mins', // Example label, replace with actual data
    // Add more bug details as needed
  };

  // Assuming there is an API endpoint for a specific bug
  // const response = await fetch(`${API_URL}/bugs/${bugId}`);
  // const data = await response.json();
  // Replace the next line with actual logic to fetch bug by bugId
  const bug = mockData; // Replace this line with actual fetching

  return bug;
}


function changeBugProgress(bugId, newProgress) {
  console.log(`The bug ${bugId} changed its progress to ${newProgress}`)
}


export { getBugsByBoardId, getBugById, changeBugProgress};
