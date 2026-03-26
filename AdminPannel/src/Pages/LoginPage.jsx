import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ DEFAULT ADMIN (AUTO FILL)
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
      const res = await API.post("/auth/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-black via-gray-900 to-gray-950 
    px-4 sm:px-6 md:px-8 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[220px] sm:w-[300px] md:w-[400px] 
      h-[220px] sm:h-[300px] md:h-[400px] 
      bg-blue-500/20 blur-3xl rounded-full top-5 left-5"></div>

      <div className="absolute w-[220px] sm:w-[300px] md:w-[400px] 
      h-[220px] sm:h-[300px] md:h-[400px] 
      bg-purple-500/20 blur-3xl rounded-full bottom-5 right-5"></div>

      {/* Card */}
      <div className="relative w-full 
        max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md
        bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-2xl sm:rounded-3xl 
        shadow-[0_20px_60px_rgba(0,0,0,0.7)] 
        p-5 sm:p-6 md:p-8">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-2">
          Admin Login 🔐
        </h2>

        <p className="text-center text-gray-300 mb-5 sm:mb-6 text-xs sm:text-sm">
          Login to access dashboard
        </p>

        {/* ❌ ERROR MESSAGE */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

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
              text-gray-300 cursor-pointer hover:text-white text-lg"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl 
            text-white font-semibold text-sm sm:text-base
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:scale-[1.02] active:scale-95 transition 
            shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo */}
        <p className="text-center text-gray-500 text-[10px] sm:text-xs mt-4">
          Default: admin@gmail.com | 123456
        </p>
      </div>

      {/* Styles */}
      <style>{`
        .inputPremium {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          outline: none;
          font-size: 14px;
          transition: 0.3s;
        }

        @media (min-width: 640px) {
          .inputPremium {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 15px;
          }
        }

        .inputPremium::placeholder {
          color: #bbb;
        }

        .inputPremium:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 12px rgba(59,130,246,0.5);
        }
      `}</style>
    </div>
  );
};

export default Auth;