import Home from './pages/home.jsx';
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import NavBar from './components/navBar.jsx';
import { Routes, Route } from 'react-router-dom';
import AddAppointment from './pages/addAppointment.jsx';
import AddDoctors from './pages/addDoctors.jsx';
import MyAppointments from './pages/myAppointments.jsx';

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<Login />} />
        <Route index path="/register" element={<Register />} />
        <Route index path="/add-appointment" element={<AddAppointment />} />
        <Route index path="/add-doctor" element={<AddDoctors />} />
        <Route index path="/my-appointments" element={<MyAppointments />} />

      </Routes>
    </>
  );
}

export default App;
