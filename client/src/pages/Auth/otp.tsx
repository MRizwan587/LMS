import React, { useState, useRef } from "react";
import { regenerateOtp, verifyOtp } from "../../services/authService";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const { email, prop } = useLocation().state as { email: string, prop: string };
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only single digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next input
    if (value && index < 5) {
      (inputsRef.current[index + 1] as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      (inputsRef.current[index - 1] as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    try {
      const response = await verifyOtp(email, finalOtp);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success("OTP verified successfully");
      if(prop === "reset-password") {
        navigate("/new-password", { replace: true, state: { email: email } });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await regenerateOtp(email);
      toast.success((response as unknown as { message: string }).message);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      (inputsRef.current[0] as HTMLInputElement).focus();
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
    width: 45px;
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
<div>
    <div className="container">
      <h2>Enter OTP</h2>
      <p>Please enter the 6-digit code sent to your email</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input className="input" key={index} type="text" maxLength={1} value={digit}
              ref={(el: HTMLInputElement | null) => {
                if (el) {
                  (inputsRef.current[index] as HTMLInputElement) = el;
                }
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button type="submit" className="button">
          Verify OTP
        </button>
      </form>
      <p>Didn't receive OTP? <a href="#" onClick={handleResendOtp}>Resend OTP</a></p>
    </div>
    </div>
    </>
  );
};

export default OtpPage;