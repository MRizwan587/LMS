import { logout } from "../../services/authService";
import type { User as UserType } from "../../types/auth";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}') as UserType;
    const HandleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className="container">
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
            .container {
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'DM Sans', sans-serif;
            }
            `}</style>
            <h1 className="title">Welcome {user.name}</h1>
            <p className="subtitle">You are logged in as {user.role}</p>
            <button className="button" onClick={() => HandleLogout()}>Logout</button>
        </div>
    );
}