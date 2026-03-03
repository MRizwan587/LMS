import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { toast } from "react-hot-toast";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { email } = useLocation().state as { email: string };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await resetPassword(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success((response as unknown as { message: string }).message);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    .container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
      align-items: center;
      font-family: 'DM Sans', sans-serif;
    }
    .form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .input {
      width: 100%;
      height: 45px;
      font-size: 20px;
      text-align: center;
      font-family: 'DM Sans', sans-serif;
    }
    .button {
      margin-top: 20px;
      background-color: #1a1a2e;
      color: #fff;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 600;
      padding: 10px 20px;
      transition: background-color 0.2s ease;
      &:hover {
        background-color: #2a2a4e;
      }
    }
    `}</style>
    <div className="container">
      <h2>Set New Password</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="password"
          placeholder="New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />

        <button type="submit" className="button">
          Update Password
        </button>
      </form>
    </div>
    </>
  );
};

export default NewPassword;