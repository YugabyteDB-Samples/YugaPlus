import React, { useState } from "react";
import { useAuth } from "../../contexts/authProvider";
import { useNavigate } from "react-router-dom";
import EyeSVG from "../SVG/eye";
function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("user1@gmail.com");
  const [password, setPassword] = useState("MyYugaPlusPassword");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = new URLSearchParams();
    loginData.append("username", email);
    loginData.append("password", password);

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: loginData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Login successful!");
          setAuth(true, navigate);
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch((error) => {
        alert("Oops, something went wrong: " + error.message);
      });
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Welcome to YugaPlus</h1>
      <h2 className="login-subheading">Sign in to continue</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            <EyeSVG className="eye-svg" />
          </button>
        </div>
        <div className="login-button-container">
          <button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
