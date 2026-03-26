import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ ADD NAME
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // ✅ LOGIN
        const res = await API.post("/auth/login", { email, password });

        if (res.status === 200) {
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
          navigate(from, { replace: true });
        }
      } else {
        // ✅ REGISTER (WITH NAME)
        const res = await API.post("/auth/register", {
          name,
          email,
          password,
        });

        if (res.status === 201) {
          alert("Admin registered successfully ✅");
          setIsLogin(true);
          setName(""); // reset
          setEmail("");
          setPassword("");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-black via-gray-900 to-gray-950 
    px-4 relative overflow-hidden">

      <div className="relative w-full max-w-md
        bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] 
        p-6">

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isLogin ? "Admin Login 🔐" : "Admin Register 📝"}
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ✅ NAME ONLY IN REGISTER */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputPremium"
              required
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            className="inputPremium"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="inputPremium pr-10"
              required
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-300 cursor-pointer"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl 
            text-white font-semibold
            bg-gradient-to-r from-blue-600 to-purple-600 
            disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* TOGGLE */}
        <p className="text-center text-gray-400 text-sm mt-4">
          {isLogin ? "Don't have admin?" : "Already registered?"}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-400 cursor-pointer ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

        {/* Demo */}
        {isLogin && (
          <p className="text-center text-gray-500 text-xs mt-3">
            Use your registered email & password
          </p>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .inputPremium {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Auth;