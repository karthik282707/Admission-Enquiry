import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdmissionForm from './components/AdmissionForm';
import Dashboard from './components/Dashboard';
import CounselorChat from './components/CounselorChat';


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
                    <Route path="/chat" element={<CounselorChatWrapper user={user} onLogout={handleLogout} />} />
                    <Route path="/" element={<Home user={user} onLogin={handleLogin} onLogout={handleLogout} />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home({ user, onLogin, onLogout }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
            {/* Left Panel: Auth (approx 25-30%) */}
            <div style={{
                flex: '0 0 380px',
                borderRight: window.innerWidth < 768 ? 'none' : '1px solid var(--glass-border)',
                borderBottom: window.innerWidth < 768 ? '1px solid var(--glass-border)' : 'none',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                height: window.innerWidth < 768 ? 'auto' : '100vh',
                position: window.innerWidth < 768 ? 'relative' : 'sticky',
                top: 0,
                zIndex: 10
            }}>
                {!user ? (
                    <Login onLogin={onLogin} isSidePanel={true} />
                ) : (
                    <div className="glass-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-outfit" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.username}</h3>
                        <p style={{ color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '1.5rem' }}>{user.role} Portal</p>

                        <button onClick={onLogout} className="btn" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            Log Out
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>Instructions:</p>
                    <ul style={{ paddingLeft: '1.25rem' }}>
                        <li>Students can fill the form immediately.</li>
                        <li>Login to track your application status.</li>
                        <li>Staff/Admin login to manage records.</li>
                    </ul>
                </div>
            </div>

            {/* Right Panel: Content */}
            <div style={{ flex: 1, height: window.innerWidth < 768 ? 'auto' : '100vh', overflowY: 'auto', background: 'rgba(255, 255, 255, 0.3)' }}>
                {user && (user.role === 'admin' || user.role === 'counselor') ? (
                    <Dashboard user={user} onLogout={onLogout} />
                ) : (
                    <AdmissionForm user={user || { username: 'Guest' }} onLogout={onLogout} isSimplified={true} />
                )}
            </div>
        </div>
    );
}

function CounselorChatWrapper({ user, onLogout }) {
    if (!user || user.role !== 'counselor') {
        return <Navigate to="/" />;
    }

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
                        onClick={() => window.location.href = '/'}
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

