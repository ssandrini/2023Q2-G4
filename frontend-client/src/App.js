import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView/LoginView';
import MyBoardsView from './views/MyBoardsView/MyBoardsView';
import BoardView from './views/BoardView/BoardView';
import AppNavbar from './components/AppNavbar/AppNavbar';
import UserView from './views/UserView/UserView';
import BugView from './views/BugView/BugView';

function App() {

  return (
    <>
    <Router>
      {localStorage.getItem("token") && <AppNavbar/>} 
      <Routes>
        <Route path="/" element={<LoginView />}/>
        <Route path="/login" element={<LoginView/>} />
        <Route path="/boards" element={<MyBoardsView/>} />
        <Route path="/boards/:boardId" element={<BoardView />} />
        <Route path="/boards/:boardId/bugs/:bugId" element={<BugView />} />
        <Route path="/me" element={<UserView/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
