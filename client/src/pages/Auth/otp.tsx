import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { regenerateOtp, verifyOtp } from "../../services/authService";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent) => void;
  error?: string;
};

const OtpInput = forwardRef<{ focusFirst: () => void } | null, OtpInputProps>(
  ({ value = "", onChange, onBlur, error }, ref) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);

    useImperativeHandle(ref, () => ({
      focusFirst: () => inputsRef.current[0]?.focus(),
    }));

    const handleChange = (digit: string, index: number) => {
      if (!/^[0-9]?$/.test(digit)) return;
      const next = [...digits];
      next[index] = digit;
      onChange?.(next.join(""));
      if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    };

    return (
      <div className="otp-container">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            className="input"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onBlur={onBlur}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    );
  }
);

const OtpPage = () => {
  const navigate = useNavigate();
  const otpInputRef = useRef<{ focusFirst: () => void } | null>(null);
  const { email, prop } = (useLocation().state as { email: string; prop?: string }) ?? { email: "", prop: "" };

  const initialValues = { otp: "" };
  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .length(OTP_LENGTH, `Enter ${OTP_LENGTH} digits`)
      .matches(/^\d+$/, "Only numbers allowed"),
  });

  const handleSubmit = async (values: { otp: string }) => {
    try {
      const response = await verifyOtp(email, values.otp);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success("OTP verified successfully");
      if (prop === "reset-password") {
        navigate("/new-password", { replace: true, state: { email } });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleResendOtp = async (setFieldValue: (field: string, value: string) => void) => {
    try {
      const response = await regenerateOtp(email);
      toast.success((response as unknown as { message: string }).message);
      setFieldValue("otp", "");
      otpInputRef.current?.focusFirst();
    } catch (error) {
      otpInputRef.current?.focusFirst();
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .container { height: 100vh; display: flex; flex-direction: column; justify-content: center; gap: 20px; align-items: center; font-family: 'DM Sans', sans-serif; }
        .form { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .input { color: #111; width: 45px; border: 1px solid #6366f1; border-radius: 12px; margin: 5px; height: 45px; font-size: 20px; text-align: center; font-family: 'DM Sans', sans-serif; }
        .button { margin-top: 20px; background-color: #1a1a2e; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; padding: 10px 20px; transition: background-color 0.2s ease; }
        .button:hover { background-color: #2a2a4e; }
        .button-link { background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; }
        .button-link:hover { text-decoration: underline; }
      `}</style>
      <div>
        <div className="container">
          <h2>Enter OTP</h2>
          <p>Please enter the 6-digit code sent to your email</p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <>
                <Form className="form">
                <Field name="otp">
                  {({ field, meta }: { field: { value: string; onBlur: (e: React.FocusEvent) => void }; meta: { error?: string; touched?: boolean } }) => (
                    <OtpInput
                      ref={otpInputRef}
                      value={field.value}
                      onChange={(v) => setFieldValue("otp", v)}
                      onBlur={field.onBlur}
                      error={meta.touched ? meta.error : undefined}
                    />
                  )}
                </Field>
                  <button type="submit" className="button">
                    Verify OTP
                  </button>
                </Form>
                <p>
                  Didn't receive OTP?{" "}
                  <button type="button" className="button-link" onClick={() => handleResendOtp(setFieldValue)}>
                    Resend OTP
                  </button>
                </p>
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default OtpPage;