import React, { useState } from "react";
import "./StudentLogin.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-container">

      {/* HOME BUTTON */}
      <button className="home-btn" onClick={() => navigate("/")}>
        ← Go Home
      </button>

      <div className="login-card">

        {/* LEFT */}
        <div className="login-left">
          <h2>Student Login</h2>
          <p>Enter your account details</p>

          <div className="input-group">
            <input type="text" placeholder="Username / Admission No" />
          </div>

          <div className="input-group password">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="forgot">Forgot Password?</div>

          <button className="login-btn">Login</button>

          <div className="signup">
            Don’t have an account? <span>Contact Admin</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h1>Welcome Back 👋</h1>
          <p>Access your student dashboard</p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            alt="student"
          />
        </div>

      </div>
    </div>
  );
};

export default StudentLogin;