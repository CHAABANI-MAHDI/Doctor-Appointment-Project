import Home from './pages/home.jsx';
import Login from "./components/login.jsx";
import NavBar from './components/navBar.jsx';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
