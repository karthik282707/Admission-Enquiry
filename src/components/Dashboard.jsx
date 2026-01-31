import React, { useState, useEffect } from 'react';
import { LogOut, Users, Search, Download, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({ user, onLogout }) => {
    const [admissions, setAdmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('admissions') || '[]');
        setAdmissions(data);
    }, []);

    const filteredData = admissions.filter(item =>
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.appNumber && item.appNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="font-outfit" style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, var(--primary), #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {user.role === 'admin' ? 'Admin Control Center' : 'Counselor Dashboard'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Managing Student Admissions | Logged in as {user.username}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user.role === 'counselor' && (
                        <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Chat Assistant
                        </button>
                    )}
                    <button onClick={onLogout} className="btn" style={{ background: 'var(--glass-bg)', color: 'var(--error)' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '1rem' }}>
                        <Users color="var(--primary)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{admissions.length}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Applications</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '1rem' }}>
                        <CheckCircle color="var(--success)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{admissions.filter(a => a.status === 'Approved').length}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Processed</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '1rem' }}>
                        <Clock color="#f59e0b" />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{admissions.filter(a => a.status === 'Pending').length}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending Review</div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search by App No, Student Name, etc..."
                            style={{ paddingLeft: '3rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn" style={{ background: 'var(--glass-bg)' }}>
                        <Download size={18} /> Export CSV
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '1rem' }}>App No.</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Student Name</th>
                                <th style={{ padding: '1rem' }}>Course</th>
                                <th style={{ padding: '1rem' }}>Institute</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? filteredData.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{item.appNumber || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>{item.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{item.studentName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{item.studentUsername}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{item.course}</td>
                                    <td style={{ padding: '1rem' }}>{item.institution}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            background: item.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: item.status === 'Pending' ? '#f59e0b' : 'var(--success)',
                                            border: `1px solid ${item.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                        }}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No admission applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
