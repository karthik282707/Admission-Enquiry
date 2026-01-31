import React, { useState, useEffect } from 'react';
import { LogOut, Users, Search, Download, CheckCircle, Clock, Eye, Smartphone, GraduationCap, Clipboard, X, Briefcase, MapPin, Calendar, Award, BookOpen, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CounselorChat from './CounselorChat';


const Dashboard = ({ user, onLogout }) => {
    const [admissions, setAdmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [statView, setStatView] = useState('districts'); // districts, gender, quota, transport
    const navigate = useNavigate();


    useEffect(() => {
        const loadData = () => {
            const data = JSON.parse(localStorage.getItem('admissions') || '[]');
            setAdmissions(data);
        };

        loadData();

        // Listen for storage changes from other tabs
        window.addEventListener('storage', loadData);

        // Polling as fallback for same-tab updates
        const interval = setInterval(loadData, 3000);

        return () => {
            window.removeEventListener('storage', loadData);
            clearInterval(interval);
        };
    }, []);

    const filteredData = admissions.filter(item => {
        const s = searchTerm.toLowerCase();
        return (
            (item.studentName || '').toLowerCase().includes(s) ||
            (item.course || '').toLowerCase().includes(s) ||
            (item.institution || '').toLowerCase().includes(s) ||
            (item.appNumber || '').toLowerCase().includes(s) ||
            (item.phone1 || '').toLowerCase().includes(s) ||
            (item.phone2 || '').toLowerCase().includes(s) ||
            (item.phone3 || '').toLowerCase().includes(s) ||
            (item.schoolName || '').toLowerCase().includes(s) ||
            (item.district || '').toLowerCase().includes(s) ||
            (item.aadhaarNo || '').toLowerCase().includes(s)
        );
    });

    const DetailItem = ({ label, value, icon: Icon }) => (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
                marginBottom: '0.25rem'
            }}>
                {Icon && <Icon size={12} />} {label}
            </label>
            <div style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '500' }}>
                {value || 'N/A'}
            </div>
        </div>
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
                    <button onClick={onLogout} className="btn" style={{ background: 'var(--glass-bg)', color: 'var(--error)' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>

            </div>

            {user.role === 'counselor' ? (
                <CounselorChat user={user} />
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Summary Stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ background: 'rgba(30, 58, 138, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Users size={20} color="var(--primary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{admissions.length}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Apps</div>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--success)' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <CheckCircle size={20} color="var(--success)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{admissions.filter(a => a.status === 'Approved').length}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Approved</div>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Clock size={20} color="#f59e0b" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{admissions.filter(a => a.status === 'Pending').length}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</div>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #8b5cf6' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Calculator size={20} color="#8b5cf6" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {(() => {
                                            const scores = admissions.map(a => parseFloat(a.marks12th?.cutoff)).filter(c => !isNaN(c) && c > 0);
                                            return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
                                        })()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg. Cutoff</div>
                                </div>
                            </div>
                        </div>

                        {/* Live Feed Analytics */}
                        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 className="font-outfit" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                                    Live Admission Analytics
                                </h3>
                                <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.5rem', flexWrap: 'wrap' }}>
                                    {['districts', 'gender', 'quota', 'transport', 'cutoff'].map(view => (
                                        <button
                                            key={view}
                                            onClick={() => setStatView(view)}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                                border: 'none',
                                                background: statView === view ? '#fff' : 'transparent',
                                                borderRadius: '0.4rem',
                                                cursor: 'pointer',
                                                boxShadow: statView === view ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                color: statView === view ? 'var(--primary)' : 'var(--text-muted)',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                {statView === 'districts' && (
                                    Object.entries(admissions.reduce((acc, a) => {
                                        const d = a.district || 'Other';
                                        acc[d] = (acc[d] || 0) + 1;
                                        return acc;
                                    }, {}))
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([name, count]) => (
                                            <div key={name} style={{
                                                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                                                padding: '1.25rem',
                                                borderRadius: '1.25rem',
                                                textAlign: 'center',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.25rem',
                                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                            }}>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{name}</div>
                                                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                                    <MapPin size={16} style={{ opacity: 0.5 }} />
                                                    {count}
                                                </div>
                                            </div>
                                        ))
                                )}
                                {statView === 'gender' && (
                                    <>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #7dd3fc',
                                            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MALE</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0c4a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Users size={24} />
                                                {admissions.filter(a => (a.gender || '').toUpperCase() === 'MALE').length}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #f9a8d4',
                                            boxShadow: '0 10px 15px -3px rgba(219, 39, 119, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#9d174d', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>FEMALE</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#700d2f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Users size={24} />
                                                {admissions.filter(a => (a.gender || '').toUpperCase() === 'FEMALE').length}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {statView === 'quota' && (
                                    <>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #86efac',
                                            boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>GOVERNMENT</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Award size={24} />
                                                {admissions.filter(a => (a.quota || '').toUpperCase() === 'GOVERNMENT').length}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #fde047',
                                            boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MANAGEMENT</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#713f12', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Briefcase size={24} />
                                                {admissions.filter(a => (a.quota || '').toUpperCase() === 'MANAGEMENT').length}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {statView === 'transport' && (
                                    <>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #bfdbfe',
                                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>BUS TRANSPORT</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <Smartphone size={24} />
                                                {admissions.filter(a => (a.bus || '').toUpperCase() === 'YES').length}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                                            padding: '1.5rem',
                                            borderRadius: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid #ddd6fe',
                                            boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)'
                                        }}>
                                            <div style={{ fontSize: '0.8rem', color: '#5b21b6', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>HOSTELLER</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4c1d95', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <GraduationCap size={24} />
                                                {admissions.filter(a => (a.hostel || '').toUpperCase() === 'YES').length}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {statView === 'cutoff' && (
                                    <div style={{
                                        gridColumn: 'span 2',
                                        background: 'linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%)',
                                        padding: '2rem',
                                        borderRadius: '1.5rem',
                                        textAlign: 'center',
                                        border: '1px solid #c4b5fd',
                                        boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)'
                                    }}>
                                        <div style={{ fontSize: '0.9rem', color: '#5b21b6', fontWeight: '800', marginBottom: '1rem', letterSpacing: '0.1em' }}>AGGREGATE CUTOFF AVERAGE (12TH)</div>
                                        <div style={{ fontSize: '4rem', fontWeight: '950', color: '#2e1065', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                            <Calculator size={48} style={{ opacity: 0.3 }} />
                                            {(() => {
                                                const scores = admissions.map(a => parseFloat(a.marks12th?.cutoff)).filter(c => !isNaN(c) && c > 0);
                                                return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
                                            })()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6d28d9', marginTop: '0.5rem', fontWeight: '600' }}>
                                            Based on {admissions.map(a => parseFloat(a.marks12th?.cutoff)).filter(c => !isNaN(c) && c > 0).length} valid submissions
                                        </div>
                                    </div>
                                )}
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
                                    placeholder="Search by Name, Phone, School, App No..."
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
                                        <th style={{ padding: '1rem' }}>Student Details</th>
                                        <th style={{ padding: '1rem' }}>Course & School</th>
                                        <th style={{ padding: '1rem' }}>Contact</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? filteredData.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => setSelectedAdmission(item)}>
                                            <td style={{ padding: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{item.appNumber || 'N/A'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '600' }}>{item.studentName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DOB: {item.dob} | {item.gender}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '500' }}>{item.course}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.schoolName}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.875rem' }}>{item.phone1}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.phone2}</div>
                                            </td>
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
                                            <td style={{ padding: '1rem' }}>
                                                <button className="btn" style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)' }}>
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                No admission applications found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Highly Attractive Detail View Modal */}
                    {selectedAdmission && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1.5rem'
                        }} onClick={() => setSelectedAdmission(null)}>
                            <div className="animate-scale-in" style={{
                                width: '100%',
                                maxWidth: '1000px',
                                maxHeight: '95vh',
                                overflow: 'hidden',
                                background: '#f8fafc',
                                borderRadius: '1.5rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }} onClick={e => e.stopPropagation()}>

                                {/* Header Section */}
                                <div style={{
                                    padding: '2.5rem',
                                    background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
                                    color: '#ffffff',
                                    position: 'relative',
                                    flexShrink: 0
                                }}>
                                    <button
                                        onClick={() => setSelectedAdmission(null)}
                                        style={{
                                            position: 'absolute',
                                            right: '1.5rem',
                                            top: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#ffffff',
                                            padding: '0.5rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            zIndex: 10
                                        }}
                                    >
                                        <X size={20} />
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: '1.25rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            flexShrink: 0
                                        }}>
                                            {selectedAdmission.studentName ? selectedAdmission.studentName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                <h2 className="font-outfit" style={{
                                                    fontSize: '2.5rem',
                                                    margin: 0,
                                                    fontWeight: '700',
                                                    color: '#ffffff',
                                                    letterSpacing: '-0.02em',
                                                    lineHeight: '1.2'
                                                }}>
                                                    {selectedAdmission.studentName}
                                                </h2>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '2rem',
                                                    fontSize: '0.85rem',
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    color: '#ffffff',
                                                    fontWeight: '600',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    letterSpacing: '0.05em'
                                                }}>{selectedAdmission.appNumber}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1.5rem', opacity: '0.9', fontSize: '1rem', flexWrap: 'wrap' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Award size={16} /> {selectedAdmission.course}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {selectedAdmission.institution}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> Applied on {new Date(selectedAdmission.id).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Body */}
                                <div style={{
                                    flex: 1,
                                    padding: '2.5rem',
                                    overflowY: 'auto',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '2.5rem'
                                }}>

                                    {/* Column 1 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Personal info card */}
                                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                                <Users size={18} /> Personal Profile
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <DetailItem label="Gender" value={selectedAdmission.gender} />
                                                <DetailItem label="Date of Birth" value={selectedAdmission.dob} />
                                                <DetailItem label="Community" value={selectedAdmission.community} />
                                                <DetailItem label="Aadhaar No" value={selectedAdmission.aadhaarNo} />
                                                <DetailItem label="Annual Income" value={`Rs. ${selectedAdmission.annualIncome}`} />
                                                <DetailItem label="Quota" value={selectedAdmission.quota} />
                                            </div>
                                        </div>

                                        {/* Family info card */}
                                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                                <Users size={18} /> Family Details
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <DetailItem label="Father's Name" value={selectedAdmission.fatherName} />
                                                <DetailItem label="Occupation" value={selectedAdmission.fatherOccupation} />
                                                <DetailItem label="Mother's Name" value={selectedAdmission.motherName} />
                                                <DetailItem label="Occupation" value={selectedAdmission.motherOccupation} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2 */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Academic card */}
                                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                                <GraduationCap size={18} /> Academic Excellence
                                            </h3>
                                            <DetailItem label="Last School Attended" value={selectedAdmission.schoolName} icon={BookOpen} />

                                            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem' }}>
                                                <DetailItem label="Board" value={selectedAdmission.boardOfStudy} />
                                                <DetailItem label="Type" value={selectedAdmission.schoolType} />
                                                <DetailItem label="Medium" value={selectedAdmission.mediumOfInstruction} />
                                            </div>

                                            {selectedAdmission.marks12th && (
                                                <div style={{
                                                    background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
                                                    padding: '1.25rem',
                                                    borderRadius: '1rem',
                                                    border: '1px solid #bae6fd',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: '600', textTransform: 'uppercase' }}>12th Engineering Cutoff</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#0ea5e9' }}>Phys / 2 + Chem / 2 + Maths</div>
                                                    </div>
                                                    <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedAdmission.marks12th.cutoff}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact & Misc card */}
                                        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                                <Smartphone size={18} /> Communication & Utilities
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <DetailItem label="Student Phone" value={selectedAdmission.phone1} />
                                                <DetailItem label="Parent Phone" value={selectedAdmission.phone2} />
                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <DetailItem label="Permanent Address" value={`${selectedAdmission.address}, ${selectedAdmission.pincode}`} icon={MapPin} />
                                                </div>
                                                <DetailItem label="Hostel" value={selectedAdmission.hostel} />
                                                <DetailItem label="College Bus" value={selectedAdmission.bus === 'YES' ? `Yes at ${selectedAdmission.busPoint}` : 'No'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Action Bar */}
                                <div style={{
                                    padding: '1.5rem 2.5rem',
                                    background: '#fff',
                                    borderTop: '1px solid #f1f5f9',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <div style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: selectedAdmission.status === 'Approved' ? 'var(--success)' : '#f59e0b'
                                        }}></div>
                                        Current Status: <span style={{ fontWeight: '600', color: selectedAdmission.status === 'Approved' ? 'var(--success)' : '#f59e0b' }}>{selectedAdmission.status}</span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedAdmission(null)}
                                        className="btn"
                                        style={{ background: '#f1f5f9', color: '#475569', padding: '0.8rem 1.5rem' }}
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        style={{
                                            padding: '0.8rem 2rem',
                                            fontSize: '1rem',
                                            boxShadow: selectedAdmission.status === 'Approved' ? 'none' : '0 10px 15px -3px rgba(30, 58, 138, 0.3)'
                                        }}
                                        onClick={() => {
                                            const updatedAdmissions = admissions.map(a =>
                                                a.id === selectedAdmission.id ? { ...a, status: 'Approved' } : a
                                            );
                                            localStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
                                            setAdmissions(updatedAdmissions);
                                            setSelectedAdmission(prev => ({ ...prev, status: 'Approved' }));
                                        }}
                                        disabled={selectedAdmission.status === 'Approved'}
                                    >
                                        {selectedAdmission.status === 'Approved' ? (
                                            <><CheckCircle size={18} /> Application Approved</>
                                        ) : (
                                            'Approve Application'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
