import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import './App.css';

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  return (
    <Router>
      
      {/* make sure navbar only shows when user is loggedin */}
      {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />} 
      <div className="app">
        <Routes>
          <Route 
            path= "/" 
            element = {
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
              )
            } 
          />
          <Route
            path = "/dashboard"
            element = {
              <Dashboard/>
            }
          />
    
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
