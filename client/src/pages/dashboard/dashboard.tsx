import { logout } from "../../services/authService";
import type { User as UserType } from "../../types/auth";
import { HasRole } from '../../components/auth/HasRole.tsx';
export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as UserType;
    const HandleLogout = () => {
        logout();
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

            <HasRole roles={['librarian', 'author']}>
                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-blue-800">
                    You are a librarian or author — you can manage books and reset passwords.
                </div>
            </HasRole>
            <HasRole roles={['student']}>
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800">
                    You are a student — you can browse and issue books.
                </div>
            </HasRole>
            <button className="button" onClick={() => HandleLogout()}>Logout</button>
        </div>
    );
}