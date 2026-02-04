import Home from './pages/home.jsx';
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import NavBar from './components/navBar.jsx';
import { Routes, Route } from 'react-router-dom';
import  AddAppointment from './pages/addAppointment.jsx';


function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<Login />} />
        <Route index path="/register" element={<Register />} />
        <Route index path="/createApt" element={<AddAppointment />} />
      </Routes>
    </>
  );
}

export default App;
