import React, { useState } from "react";
import "./Loginform.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Hello Again</h1>
        <p className="login-subtitle">
          Enter your credentials to access your account.
        </p>

        <form className="login-form">
          <div className="input-group">
            <span className="icon">📧</span>
            <input type="email" placeholder="Email Address" required />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">
              Forgot Password?
            </a>
          </div>

          <button className="login-btn">Login</button>

          <p className="register-text">
            Don’t have an account? <a href="/register">Register Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
