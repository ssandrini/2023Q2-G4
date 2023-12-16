import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView/LoginView';
import MyBoardsView from './views/MyBoardsView/MyBoardsView';
import BoardView from './views/BoardView/BoardView';
import AppNavbar from './components/AppNavbar/AppNavbar';

function App() {

  return (
    <>
    {localStorage.getItem("token") && <AppNavbar/>} 
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/myboards" element={<MyBoardsView />} />
        <Route path="/myboards/:boardId" element={<BoardView />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
