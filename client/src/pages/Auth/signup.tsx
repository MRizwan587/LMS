import { useState } from "react";
import { signup } from "../../services/authService";
import { toast } from "react-hot-toast";
import type { SignupData as SignupDataType } from "../../types/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        rollNumber: "",
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleRoleSelect = (value: string) => {
        setForm((prev) => ({ ...prev, role: value, rollNumber: "" }));
      };
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await signup(form as SignupDataType);
            navigate("/otp", { replace: true, state: { email: form.email } });
        } catch (error) {
            toast.error((error as Error).message);
        }
      };
    
      const roles = [
        { value: "student", label: "Student"},
        { value: "librarian", label: "Librarian"},
        { value: "author", label: "Author"},
      ];
    
      const showRoll = form.role === "student";
      const [showPassword, setShowPassword] = useState(false);
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 93vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f4ef;
          position: relative;
          overflow: hidden;
          padding: 30px 16px;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.55;
        }
        .blob-1 { width: 500px; height: 500px; top: -150px; right: -100px; background: #ddd8f5; }
        .blob-2 { width: 400px; height: 400px; bottom: -120px; left: -80px; background: #f0e9d6; }
        .blob-3 { width: 240px; height: 240px; top: 40%; left: 30%; background: #e8e4f8; }

        .card {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 24px;
          padding: 48px 48px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.9);
        }

        .card-logo {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: #1a1a2e;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          color: #111;
          margin: 0 0 6px;
          line-height: 1.2;
          letter-spacing: -0.4px;
        }
        .card-title em { font-style: italic; color: #6366f1; }

        .card-sub {
          font-size: 14px;
          color: #999;
          margin: 0 0 32px;
          font-weight: 300;
        }

        .field-group { margin-bottom: 18px; }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          padding: 13px 16px;
          background: #faf9f7;
          border: 1.5px solid #e8e3db;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #bbb; }
        .field-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }

        /* Password hint */
        .field-hint {
          font-size: 11px;
          color: #bbb;
          margin-top: 5px;
          letter-spacing: 0.2px;
        }

        /* Role selector */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 8px;
          background: #faf9f7;
          border: 1.5px solid #e8e3db;
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          user-select: none;
        }
        .role-card:hover {
          border-color: #c7c4f0;
          background: #f5f4ff;
        }
        .role-card.selected {
          border-color: #6366f1;
          background: #f0f0ff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .role-emoji { font-size: 22px; }
        .role-name {
          font-size: 12px;
          font-weight: 600;
          color: #444;
          letter-spacing: 0.2px;
        }
        .role-card.selected .role-name { color: #6366f1; }

        /* Roll number slide-in */
        .roll-wrapper {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
          max-height: 0;
          opacity: 0;
        }
        .roll-wrapper.visible {
          max-height: 100px;
          opacity: 1;
        }
        .roll-inner { padding-top: 18px; }

        /* Submit */
        .submit-btn {
          width: 100%;
          margin-top: 28px;
          padding: 15px;
          background: #1a1a2e;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.2px;
        }
        .submit-btn-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.35);
        }
        .submit-btn:active { transform: translateY(0); }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 0;
          color: #ccc;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ede9e1;
        }

        .card-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 13.5px;
          color: #999;
        }
        .card-footer a {
          color: #1a1a2e;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid #6366f1;
          padding-bottom: 1px;
        }
        .card-footer a:hover { color: #6366f1; }
      `}</style>

      <div className="signup-root">
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />

        <div className="card">
          <div className="card-logo">
            <div className="logo-icon">📚</div>
            <div className="card-logo-text">
            <span className="logo-text">Library Management System</span>
            <p className="card-sub">Create your account to get started.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input type="text" name="name" className="field-input" placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <input type="email" name="email" className="field-input" placeholder="Enter your email address" value={form.email} onChange={handleChange} required />
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="password-input-container" style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password" className="field-input" placeholder="••••••••••" value={form.password} onChange={handleChange} minLength={8} required />
                <button type="button" className="toggle-password-btn" onClick={togglePasswordVisibility} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer" }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
                </div>
              <p className="field-hint">Minimum 8 characters</p>
            </div>

            {/* Role */}
            <div className="field-group">
              <label className="field-label">I am a</label>
              <div className="role-grid">
                {roles.map((r) => (
                  <div
                    key={r.value}
                    className={`role-card ${form.role === r.value ? "selected" : ""}`}
                    onClick={() => handleRoleSelect(r.value)}
                  >
                    {/* <span className="role-emoji">{r.icon}</span> */}
                    <span className="role-name">{r.label}</span>
                  </div>
                ))}
              </div>
              {/* hidden input for form validation */}
              <input type="text" name="role" value={form.role} onChange={() => {}} required style={{ opacity: 0, height: 0, width: 0, position: "absolute", pointerEvents: "none" }} />
            </div>

            {/* Roll Number — only for students */}
            <div className={`roll-wrapper ${showRoll ? "visible" : ""}`}>
              <div className="roll-inner">
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">Roll Number</label>
                  <input type="text" className="field-input" placeholder="Enter your roll number" name="rollNumber" value={form.rollNumber} onChange={handleChange} required={showRoll} />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <span className="submit-btn-inner">Create Account →</span>
            </button>
          </form>

          <div className="divider">or</div>

          <p className="card-footer">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}