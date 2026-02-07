import Home from "./pages/home.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import NavBar from "./components/navBar.jsx";
import { Routes, Route } from "react-router-dom";
import AddAppointment from "./pages/addAppointment.jsx";
import DoctorsPage from "./pages/DoctorsPage.jsx";
import MyAppointments from "./pages/myAppointments.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import Appointments from "./pages/AppointmentsPage.jsx";
import Departments from "./pages/DepartmentsPage.jsx";
import UsersPage from "./pages/usersAPage.jsx";
import ServicesPage from "./pages/servicesPage.jsx";
import AboutUsPage from "./pages/aboutUsPage.jsx";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import DoctorProfilePage from "./pages/DoctorProfilePage.jsx";
import AdminProfilePage from "./pages/AdminProfilePage.jsx";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<Login />} />
        <Route index path="/register" element={<Register />} />
        <Route index path="/services" element={<ServicesPage />} />
        <Route index path="/about-us" element={<AboutUsPage />} />
        <Route index path="/add-appointment" element={<AddAppointment />} />
        <Route index path="/my-appointments" element={<MyAppointments />} />
        <Route
          index
          path="/doctor-appointments"
          element={<DoctorAppointmentsPage />}
        />
        <Route index path="/profile" element={<UserProfilePage />} />
        <Route index path="/doctor-profile" element={<DoctorProfilePage />} />
        <Route index path="/admin-profile" element={<AdminProfilePage />} />
        <Route index path="/admin-overview" element={<OverviewPage />} />
        <Route index path="/admin-doctors" element={<DoctorsPage />} />
        <Route index path="/admin-appointments" element={<Appointments />} />
        <Route index path="/admin-departments" element={<Departments />} />
        <Route index path="/admin-users" element={<UsersPage />} />
      </Routes>
    </>
  );
}

export default App;
