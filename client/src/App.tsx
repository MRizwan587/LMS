import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import Dashboard from './pages/dashboard/dashboard';
import OtpPage from './pages/Auth/otp';
import { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/Auth/Resetpassword';
import NewPassword from './pages/Auth/Newpassword';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    </Router>
  );
}

export default App
