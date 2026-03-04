import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { LoginData as LoginDataType } from '../../types/auth';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (values: LoginDataType) => {
    try {
      const response = await login(values);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success("Login successful");
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Formik initialValues={{ email: '', password: '' }}
    validationSchema={Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Email is required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    })}
    onSubmit={(values: LoginDataType) => handleSubmit(values)}>
      <div className="flex justify-center items-center h-screen">
     <Form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 space-y-6">

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Field type="email" name="email" placeholder="Enter your email address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>

          <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1"/>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>

          <div className="relative">
            <Field type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-16"/>

            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1"/>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md cursor-pointer">
          Sign In →
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="text-center space-y-2 text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Create one
            </Link>
          </p>

          <p>
            Forgot your password?{" "}
            <Link to="/reset-password" className="text-blue-600 hover:underline font-medium">
              Reset Password
            </Link>
          </p>
        </div>

      </Form>
    </div>
    </Formik>
  );
};

export default Login;