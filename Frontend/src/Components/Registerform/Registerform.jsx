import React, { useState } from "react";
import "./Registerform.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="register-title">Register Now!</h1>
        <p className="register-subtitle">You can signup here</p>

        <form className="register-form">
          <div className="input-group">
            <span className="icon">👤</span>
            <input type="text" placeholder="Full Name" required />
          </div>

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
              👁️
            </button>
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Your Password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              👁️
            </button>
          </div>

          <label className="remember">
            <input type="checkbox" />
            Remember me
          </label>

          <button className="register-btn">Register Now</button>

          <p className="login-text">
            Already have an account? <a href="#">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
