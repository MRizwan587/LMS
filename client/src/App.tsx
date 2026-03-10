import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import OtpPage from './pages/Auth/otp';
import { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/Auth/Resetpassword';
import NewPassword from './pages/Auth/Newpassword';
import { RequireAuth, HasRoleRoute } from './components/auth/HasRole.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import BooksPage from './pages/dashboard/BooksPage';
import MyIssuesPage from './pages/dashboard/MyIssuesPage';
import StudentsPage from './pages/dashboard/StudentsPage';
import AssignedBooksPage from './pages/dashboard/AssignedBooksPage';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/" element={<RequireAuth redirectTo="/login"><DashboardLayout /></RequireAuth>}>
          <Route index element={<DashboardHome />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="my-issues" element={<MyIssuesPage />} />
          <Route path="students" element={<HasRoleRoute roles={['librarian']}><StudentsPage /></HasRoleRoute>} />
          <Route path="assigned-books" element={<HasRoleRoute roles={['librarian']}><AssignedBooksPage /></HasRoleRoute>} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
