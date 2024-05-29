import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode"; 
import "./Navbar.css";

export const Navbar = () => {
  let navigate = useNavigate();
  let token;
  let decoded;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    decoded = jwtDecode(token);
  }
  function handleLogout() {
    if (localStorage.getItem("token")) {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        console.log("Logout successfully");
        navigate("/");
      }
    }
  }

  return (
    <div className="navbar">
      <h1 id="recipely">Recipely</h1>
      {token ? (
        <div className="links1">
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/create-recipe" className="link">
            Create Recipe
          </Link>
          <Link to="/saved-recipes" className="link">
            Saved Recipes
          </Link>
          <Link onClick={handleLogout} to="/" className="link">
            Logout
          </Link>
        </div>
      ) : (
        <div className="links2">
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/login" className="link">
            Login
          </Link>
          <Link to="/register" className="link">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};
