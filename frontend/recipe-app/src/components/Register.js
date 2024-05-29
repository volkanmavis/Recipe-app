import { useState } from "react"; // Allows us to store values in state
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./Register.css"

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const register = async (event) => {
    event.preventDefault();
    try {
      let user = { username, password };
      let res = await axios.post(`https://recipe-app-x7py.onrender.com/auth/register`, user);
      console.log(res.data.message);
      console.log(res.data);
      navigate("/login");
      alert("Registered successfully! Please login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="registerWraper">
    <div>
      <form onSubmit={register} className="registerForm">
        <h2>Register</h2>
        <div className="element">
          <label htmlFor="username">Username:</label>
          <input type="text" value={username} id="username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="element">
          <label htmlFor="password">Password:</label>
          <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" value="Register">
          Register
        </button>
      </form>
    </div>
    </div>
  );
};
