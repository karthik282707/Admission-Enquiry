import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import AdmissionForm from './components/AdmissionForm';
import Dashboard from './components/Dashboard';
import CounselorChat from './components/CounselorChat';
import LandingPage from './components/LandingPage';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <LoginPage onLogin={handleLogin} />
                            )
                        }
                    />

                    <Route
                        path="/enquiry"
                        element={<AdmissionForm user={user || { username: 'Guest' }} onLogout={handleLogout} />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            user && (user.role === 'admin' || user.role === 'counselor') ? (
                                <DashboardPage user={user} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            user && user.role === 'counselor' ? (
                                <ChatPage user={user} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

// Wrapper Components to provide consistent layout for separate pages
function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', background: 'rgba(255, 255, 255, 0.3)' }}>
            <div style={{ padding: '1rem' }}>
                <button onClick={() => navigate('/')} className="btn" style={{ background: 'var(--glass-bg)' }}>
                    ← Back to Home
                </button>
            </div>
            <Login onLogin={onLogin} isSidePanel={false} />
        </div>
    );
}

function DashboardPage({ user, onLogout }) {
    return (
        <div style={{ minHeight: '100vh', background: 'rgba(255, 255, 255, 0.3)' }}>
            <Dashboard user={user} onLogout={onLogout} />
        </div>
    );
}

function ChatPage({ user, onLogout }) {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{
                flex: '0 0 380px',
                borderRight: '1px solid var(--glass-border)',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                height: '100vh',
                position: 'sticky',
                top: 0
            }}>
                <div className="glass-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-outfit" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.username}</h3>
                    <p style={{ color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '1.5rem' }}>{user.role} Portal</p>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn"
                        style={{ width: '100%', marginBottom: '1rem', background: 'var(--glass-bg)' }}
                    >
                        Return to Dashboard
                    </button>

                    <button onClick={onLogout} className="btn" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        Log Out
                    </button>
                </div>
            </div>
            <div style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
                <CounselorChat user={user} />
            </div>
        </div>
    );
}

export default App;


