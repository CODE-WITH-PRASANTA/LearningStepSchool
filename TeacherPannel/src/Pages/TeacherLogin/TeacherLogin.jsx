import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./TeacherLogin.css";

const TeacherLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/teacher/login", form);

      // ✅ store token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("teacher", JSON.stringify(res.data.teacher));

      // ✅ redirect
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Teacher Login</h2>
        <p className="subtitle">Access your dashboard</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input"
          />

          <button className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;