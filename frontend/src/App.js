import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Recipe from './pages/Recipes';
import Fridge from './pages/Fridge';
import Signup from './pages/Signup';
import RecipeDetails from './pages/RecipeDetails';
import Mealplan from './pages/Mealplan';
import Navbar from './components/Navbar';
import Map from './pages/Map';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
      console.log('Restored user from localStorage:', savedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', username); // Persist to localStorage
    console.log('User logged in and saved to localStorage:', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser'); // Remove from localStorage
    console.log('User logged out and removed from localStorage');
  };

  // Debug logging
  console.log('App render - currentUser:', currentUser, 'isLoggedIn:', isLoggedIn);

  return (
    <>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/signup"
            element={<Signup onSignupSuccess={() => navigate('/')} />}
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard username={currentUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/recipes"
            element={
              isLoggedIn ? <Recipe username={currentUser} />: <Navigate to="/" />
            }
          />

          <Route
            path="/fridge"
            element={
              isLoggedIn ? <Fridge username={currentUser} /> : <Navigate to="/" />
            }
          />

          <Route
            path="/recipe/:recipeId"
            element={
              isLoggedIn ? <RecipeDetails /> : <Navigate to="/" />
            }
          />

          <Route
            path="/mealplan"
            element={
              isLoggedIn ? <Mealplan username={currentUser} /> : <Navigate to="/" />
            }
          />

          <Route
            path="/map"
            element={
              isLoggedIn ? <Map /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
