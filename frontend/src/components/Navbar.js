import { Link } from 'react-router-dom'; 

export default function Navbar({ onLogout }) {
    return (
      <nav className = "navbar">
        <div className="navbar-content">
        <span className = "navbar-brand">BiteBuddy</span>
        <div className = "navbar-links">
        <Link to="/dashboard"> Dashboard </Link>
        <Link to="/recipes"> Recipes </Link>
        <Link to ="/mealplan"> Meal Plan </Link>
        <Link to ="/fridge"> My Fridge </Link>
        <Link to ="/map"> Map </Link>
        </div>
        <Link to="/" onClick={(onLogout)} className="logout-btn" >
        Log Out
      </Link>
        </div>
      </nav>
    );
  }