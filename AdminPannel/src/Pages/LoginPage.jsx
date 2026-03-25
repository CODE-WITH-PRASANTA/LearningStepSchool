import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 SMART REDIRECT
  const from = location.state?.from?.pathname || "/dashboard";

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });

        if (res.status === 200) {
          // ✅ FIX AUTH STORAGE
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          // ✅ REDIRECT
          navigate(from, { replace: true });
        }
      } else {
        const res = await API.post("/auth/register", {
          name,
          email,
          password,
        });

        if (res.status === 201) {
          alert("Registration successful 🎉");
          setIsLogin(true);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4">

      {/* Glow Background */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative w-full max-w-md 
        bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.7)] p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <p className="text-center text-gray-300 mb-6 text-sm">
          {isLogin ? "Login to continue" : "Signup to get started"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="inputPremium"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputPremium"
            required
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputPremium pr-10"
              required
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-300 cursor-pointer hover:text-white"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold 
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:scale-[1.03] active:scale-95 transition 
            shadow-lg disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-300 text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 ml-1 cursor-pointer hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>

        <p className="text-center text-gray-500 text-xs mt-4">
          © 2026 Admin Panel
        </p>
      </div>

      <style>{`
        .inputPremium {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          outline: none;
          transition: 0.3s;
        }

        .inputPremium::placeholder {
          color: #ccc;
        }

        .inputPremium:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59,130,246,0.6);
        }
      `}</style>
    </div>
  );
};

export default Auth;