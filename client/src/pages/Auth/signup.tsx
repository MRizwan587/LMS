import { useState } from "react";
import { signup } from "../../services/authService";
import { toast } from "react-hot-toast";
import type { SignupData as SignupDataType } from "../../types/auth";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const initialValues: SignupDataType = {
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    librarianId: "",
    authorId: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must have uppercase, lowercase, number & special char"
      ),
    role: Yup.string().required("Role is required"),
    rollNumber: Yup.string().when("role", ([role], schema) => role === "student" ? schema.required("Roll number is required") : schema.notRequired()),
    librarianId: Yup.string().when("role", ([role], schema) => role === "librarian" ? schema.required("Librarian ID is required") : schema.notRequired()),
    authorId: Yup.string().when("role", ([role], schema) => role === "author" ? schema.required("Author ID is required") : schema.notRequired()),
  });

  const handleSubmit = async (values: SignupDataType) => {
    console.log("handleSubmit called", values);
    try {
      await signup(values);
      navigate("/otp", { replace: true, state: { email: values.email } });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
          <Form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Field type="text" name="name" placeholder="Enter your name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Field type="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Field type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-16"/>
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Field as="select" name="role" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="author">Author</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Conditional Fields */}
            {values.role === "student" && (
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <Field type="text" name="rollNumber" placeholder="Enter your roll number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
                <ErrorMessage name="rollNumber" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            {values.role === "librarian" && (
              <div>
                <label htmlFor="librarianId" className="block text-sm font-medium text-gray-700 mb-1">Librarian ID</label>
                <Field type="text" name="librarianId" placeholder="Enter your librarian ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                <ErrorMessage name="librarianId" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            {values.role === "author" && (
              <div>
                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-1">Author ID</label>
                <Field type="text" name="authorId" placeholder="Enter your author ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"/>
                <ErrorMessage name="authorId" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md cursor-pointer">
              Create Account →
            </button>
            {/* Already have an account? */}
            <div className="text-center space-y-2 text-sm text-gray-600">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}