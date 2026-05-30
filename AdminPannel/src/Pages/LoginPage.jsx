import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in required fields.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          Swal.fire({
            title: "Welcome back!",
            icon: "success",
            timer: 1200,
            showConfirmButton: false,
          });

          navigate(from, { replace: true });
        }
      } else {
        const res = await API.post("/auth/register", { name, email, password });
        if (res.status === 201) {
          Swal.fire({
            title: "Account created",
            icon: "success",
            confirmButtonColor: "#6366f1",
          });

          localStorage.setItem("token", res.data.token);
          localStorage.setItem("isAdmin", "true");
          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left - Branding / Illustration */}
        <div className="hidden lg:flex flex-col justify-center px-8">
          <div className="text-white/90 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">LS</div>
              <h3 className="text-2xl font-semibold">LearningStep School</h3>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">Beautiful admin panel, built for speed.</h1>
            <p className="text-slate-300 max-w-md">Manage students, fees, attendance and more with a clean, responsive admin experience. Secure, fast and delightful.</p>

            <div className="mt-6 flex gap-3">
              <div className="w-20 h-12 bg-white/6 rounded-lg backdrop-blur-sm border border-white/10 p-3 flex items-center justify-center">
                <div className="text-sm text-white/80">Fast</div>
              </div>
              <div className="w-20 h-12 bg-white/6 rounded-lg backdrop-blur-sm border border-white/10 p-3 flex items-center justify-center">
                <div className="text-sm text-white/80">Secure</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="relative bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">LS</div>
              <div>
                <h2 className="text-xl font-semibold text-white">{isLogin ? "Admin Login" : "Create Admin"}</h2>
                <p className="text-sm text-slate-300">{isLogin ? "Sign in to continue" : "Create a new admin account"}</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">v1.0</div>
          </div>

          {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="sr-only">Admin Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="inputPremium"
                  required={!isLogin}
                />
              </label>
            )}

            <label className="block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="inputPremium"
                autoComplete="email"
                required
              />
            </label>

            <div className="relative">
              <span className="sr-only">Password</span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="inputPremium pr-12"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                aria-label={showPass ? "Hide password" : "Show password"}
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="accent-indigo-500" />
                <span className="text-slate-300">Remember me</span>
              </label>

              <button type="button" className="text-indigo-400 hover:underline text-sm" onClick={() => Swal.fire('Reset password', 'Password reset flow not implemented in demo.', 'info')}>Forgot?</button>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              ) : null}
              <span>{isLogin ? "Sign in" : "Create account"}</span>
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1"></div>
            <div className="text-xs text-slate-400">Or continue with</div>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-lg bg-white/6 border border-white/8 text-white/90 flex items-center justify-center gap-2 hover:bg-white/8">
              <FaGoogle /> <span className="text-sm">Google</span>
            </button>
            <button className="py-2 px-3 rounded-lg bg-white/6 border border-white/8 text-white/90 flex items-center gap-2 hover:bg-white/8">
              <FaApple />
            </button>
            <button className="py-2 px-3 rounded-lg bg-white/6 border border-white/8 text-white/90 flex items-center gap-2 hover:bg-white/8">
              <FaFacebook />
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-400 cursor-pointer font-medium"
            >
              {isLogin ? "Create one" : "Sign in"}
            </span>
          </p>

          <style>{`\n            .inputPremium {\n              width: 100%;\n              padding: 12px 14px;\n              border-radius: 12px;\n              background: rgba(255,255,255,0.04);\n              border: 1px solid rgba(255,255,255,0.06);\n              color: white;\n              outline: none;\n              transition: box-shadow .18s ease, transform .08s ease;\n            }\n            .inputPremium:focus { box-shadow: 0 6px 18px rgba(99,102,241,0.12); transform: translateY(-1px); }\n            @media (max-width: 768px) {\n              .inputPremium { padding: 12px; }\n            }\n          `}</style>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
