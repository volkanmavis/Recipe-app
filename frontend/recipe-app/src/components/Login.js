import { useState } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import "./Login.css"

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      let user = { username, password };
      let res = await axios.post("https://recipe-app-x7py.onrender.com/auth/login", user);
      let token = res.data.token;
      localStorage.setItem("token", token);
      console.log(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="loginWraper">
    <div>
      <form className="loginForm" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="element">
          <label htmlFor="username">Username:</label>
          <input type="text" value={username} id="username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="element">
          <label htmlFor="password">Password:</label>
          <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" value="Login">
          Login
        </button>
      </form>
    </div>
    </div>
  );
};
