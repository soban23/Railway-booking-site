import './App.css'
import Login from './components/Login.jsx'
import Register from './components/register.jsx';
import Home from './components/Home.jsx';
import RouteDetails from './components/RouteDetails.jsx';
import Profile from './components/Profile.jsx';
import User from './components/User.jsx';
import Trains from './components/Trains.jsx';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


function App() {
  return (
    <div className='root'>
      
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/routes/:id" element={<RouteDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<User />} />
            <Route path="/trains/:train_id/:station_id" element={<Trains />} />
            
        </Routes>

      </Router>
      
    </div>
  )
}

export default App;
