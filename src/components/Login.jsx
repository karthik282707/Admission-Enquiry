import React, { useState } from 'react';
import { User, ShieldCheck, Headphones, LogIn, Hash } from 'lucide-react';

const Login = ({ onLogin, isSidePanel }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [appNumber, setAppNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username && password) {
            onLogin({ username, role });
        } else {
            alert('Please enter credentials');
        }
    };

    const loginCard = (
        <div className="glass-card animate-fade-in" style={{ width: '100%', padding: isSidePanel ? '1.5rem' : '2.5rem' }}>
            <h2 className="font-outfit" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: isSidePanel ? '1.5rem' : '2rem' }}>
                {isSidePanel ? 'Portal Login' : 'Welcome Back'}
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    className={`btn ${role === 'student' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('student')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'student' ? '' : 'var(--glass-bg)' }}
                >
                    <User size={14} /> Student
                </button>
                <button
                    className={`btn ${role === 'admin' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('admin')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'admin' ? '' : 'var(--glass-bg)' }}
                >
                    <ShieldCheck size={14} /> Admin
                </button>
                <button
                    className={`btn ${role === 'counselor' ? 'btn-primary' : ''}`}
                    onClick={() => setRole('counselor')}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: role === 'counselor' ? '' : 'var(--glass-bg)' }}
                >
                    <Headphones size={14} /> Staff
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Username</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Enter Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label">Password</label>
                    <div style={{ position: 'relative' }}>
                        <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    <LogIn size={18} /> Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Demo: Use any credentials to log in
            </p>
        </div>
    );

    if (isSidePanel) return loginCard;

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                {loginCard}
            </div>
        </div>
    );
};

export default Login;
