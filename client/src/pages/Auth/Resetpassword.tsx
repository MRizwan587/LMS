import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { regenerateOtp } from "../../services/authService";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await regenerateOtp(email);
      toast.success((response as unknown as { message: string }).message);
      navigate("/otp", { replace: true, state: { email: email, prop: "reset-password" } });
    } catch (error) {
        setEmail("");
      toast.error((error as Error).message);
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
    padding: 13px 16px;
    background: #faf9f7;
    border: 1px solid #6366f1;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    
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
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Send OTP
        </button>
      </form>
    </div>
    </>
  );
};

export default ResetPassword;