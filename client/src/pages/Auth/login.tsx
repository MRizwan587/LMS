import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success("Login successful");
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

      .login-root {
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f4ef;
        position: relative;
        overflow: hidden;
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
        padding: 52px 48px;
        width: 100%;
        max-width: 440px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.08);
        border: 1px solid rgba(255,255,255,0.9);
      }

      .card-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 32px;
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
        font-size: 32px;
        color: #111;
        margin: 0 0 6px;
        line-height: 1.2;
        letter-spacing: -0.4px;
      }
      .card-title em { font-style: italic; color: #6366f1; }

      .card-sub {
        font-size: 14px;
        color: #999;
        margin: 0 0 36px;
        font-weight: 300;
      }

      .field-group { margin-bottom: 20px; }

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

      .field-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .forgot-link {
        font-size: 12px;
        color: #6366f1;
        text-decoration: none;
        font-weight: 500;
      }
      .forgot-link:hover { text-decoration: underline; }

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

      .card-footer {
        text-align: center;
        margin-top: 24px;
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
    `}</style>

    <div className="login-root">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="card">
        <div className="card-logo">
          <div className="logo-icon">📚</div>
          <span className="logo-text">Library Management System</span>
        </div>

        <h1 className="card-title"><em>Welcome </em></h1>
        <p className="card-sub">Sign in to manage your library account.</p>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email" className="field-label">Email address</label>
            <input type="email" id="email" className="field-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field-group">
            <div className="field-row">
              <label htmlFor="password" className="field-label" >Password</label>
              <a href="/reset-password" className="forgot-link">Forgot?</a>
            </div>
            <input type="password" id="password" className="field-input" placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="submit-btn">
            <span className="submit-btn-inner">Sign In →</span>
          </button>
        </form>

        <div className="divider">or</div>

        <p className="card-footer">
          Don't have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </div>
  </>
  );
};

export default Login;