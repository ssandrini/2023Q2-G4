// bugService.js

import { API_URL } from './config';

async function getBugsByBoardId(boardId) {
  const mockData = [
    { id: 'bug1', title: 'Bug 1', description: 'Description for Bug 1', label: '30 mins', progress: 'ICEBOX' },
    { id: 'bug2', title: 'Bug 2', description: 'Description for Bug 2', label: '45 mins', progress: 'TODO' },
    { id: 'bug98', title: 'Arreglar kanban board', description: 'Está todo roto', label: '45 mins', progress: 'TODO' },
  ];
  const bugs = mockData;
  return bugs;
}

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

async function createBug({ title, description, label, progress, boardId }) {
  const mockData = { id: 'newBugId', title, description, label, progress, boardId };
  const newBug = mockData;
  return newBug;
}

function changeBugProgress(bugId, newProgress) {
  console.log(`The bug ${bugId} changed its progress to ${newProgress}`);
}

export { getBugsByBoardId, getBugById, createBug, changeBugProgress };
