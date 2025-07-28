import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Recipe from './pages/Recipes'
import Fridge from './pages/Fridge'
import RecipeDetails from './pages/RecipeDetails'

import Navbar from './components/Navbar'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

const handleLogin = (username) => {
  setCurrentUser(username);
  setIsLoggedIn(true);
};
const handleLogout = () => {
  setCurrentUser(null);
  setIsLoggedIn(false);
};
  return (
    <Router>

      {/* make sure navbar only shows when user is loggedin */}
      {isLoggedIn && <Navbar onLogout={() => setIsLoggedIn(false)} />}
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                // <Login onLogin={() => setIsLoggedIn(true)} />
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path = "/dashboard"
            element = {
              isLoggedIn ?
              <Dashboard username={currentUser}/>
              :
              <Navigate to="/" />
            }
          />

          <Route
            path = "/recipes"
            element = {
              <Recipe/>
            }
          />

          <Route
            path = "/fridge"
            element = {
              isLoggedIn ?
              <Fridge username={currentUser}/>
              :
              <Navigate to="/" />

            
          }
          />

          <Route
            path = "/recipedetails"
            element = {
              <RecipeDetails/>
            }
          />

          
          <Route 
            path="/recipe/:recipeId" 
            element={<RecipeDetails />} 
          />
    

        </Routes>

      </div>
    </Router>
  );
}

export default App;
