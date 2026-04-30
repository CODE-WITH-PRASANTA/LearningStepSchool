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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="tlogin">
      <div className="tlogin-bg" aria-hidden="true" />

      <div className="tlogin-shell">
        <div className="tlogin-brand" aria-hidden="true">
          <div className="tlogin-mark">LS</div>
          <div className="tlogin-brandText">
            <div className="tlogin-brandName">LearningStepSchool</div>
            <div className="tlogin-brandHint">Teacher Portal</div>
          </div>
        </div>

        <div className="tlogin-card">
          <div className="tlogin-head">
            <h1 className="tlogin-title">Teacher Login</h1>
            <p className="tlogin-subtitle">Sign in to access your dashboard.</p>
          </div>

          {error && (
            <div className="tlogin-alert" role="alert">
              <div className="tlogin-alertIcon" aria-hidden="true">
                !
              </div>
              <div className="tlogin-alertText">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="tlogin-form">
            <div className="tlogin-field">
              <label className="tlogin-label" htmlFor="teacher-email">
                Email
              </label>
              <div className="tlogin-inputWrap">
                <span className="tlogin-inputIcon" aria-hidden="true">
                  @
                </span>
                <input
                  id="teacher-email"
                  type="email"
                  name="email"
                  placeholder="you@school.com"
                  value={form.email}
                  onChange={handleChange}
                  className="tlogin-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="tlogin-field">
              <label className="tlogin-label" htmlFor="teacher-password">
                Password
              </label>
              <div className="tlogin-inputWrap">
                <span className="tlogin-inputIcon" aria-hidden="true">
                  *
                </span>
                <input
                  id="teacher-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="tlogin-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="tlogin-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="tlogin-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="tlogin-footnote">
              By continuing, you agree to keep your account secure.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;