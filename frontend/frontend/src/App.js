import Home from './pages/home.jsx';
import NavBar from './components/navBar.jsx';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
      <NavBar />
      
      <Routes>
        <Route index path='/' element={<Home />} />
      </Routes>
    
    </>
  );
}

export default App;
