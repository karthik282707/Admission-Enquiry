import React, { useState, useEffect, useRef } from 'react';
import { Save, LogOut, FileText, ClipboardList, GraduationCap, School, Calculator, CreditCard, Search, X, ChevronDown } from 'lucide-react';

// import SCHOOL_LIST from '../data/schools.json'; // Removed static list

const AdmissionForm = ({ user, onLogout, isSimplified }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        institution: '',
        course: '',
        studentName: '',
        gender: '',
        dob: '',
        aadhaarNo: '',
        quota: '',
        fatherName: '',
        fatherOccupation: '',
        motherName: '',
        motherOccupation: '',
        annualIncome: '',
        community: '',
        district: '',
        address: '',
        pincode: '',
        phone1: '',
        phone2: '',
        phone3: '',
        schoolName: '',
        schoolType: '',
        boardOfStudy: '',
        mediumOfInstruction: '',
        marks10th: { total: '', maths: '', science: '' },
        marks11th: { total: '', phyEco: '', cheComm: '', mathsAccs: '', compBio: '' },
        marks12th: { total: '', phyEco: '', cheComm: '', mathsAccs: '', compBio: '', regNo: '', cutoff: '' },
        firstGrad: 'NO',
        pmss: 'NO',
        laptop: 'NO',
        bus: 'NO',
        busPoint: '',
        hostel: 'NO'
    });

    const [submittedAppNumber, setSubmittedAppNumber] = useState(null);
    const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [dbSchools, setDbSchools] = useState([]);
    const dropdownRef = useRef(null);

    // Fetch school blocks from API
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/school-blocks');
                if (res.ok) {
                    const data = await res.json();
                    setDbSchools(data);
                }
            } catch (err) {
                console.error("Failed to fetch schools", err);
            }
        };
        fetchSchools();
    }, []);

    const filteredSchools = schoolSearchQuery.trim() === ''
        ? []
        : dbSchools.filter(school => {
            const nameMatch = school.school_name && school.school_name.toLowerCase().includes(schoolSearchQuery.toLowerCase());
            // Optional: You could also search by district if you wanted
            return nameMatch;
        }).sort((a, b) => {
            // 1. Sort by District match if district is entered
            if (formData.district) {
                const aInDistrict = a.district.toLowerCase() === formData.district.toLowerCase();
                const bInDistrict = b.district.toLowerCase() === formData.district.toLowerCase();
                if (aInDistrict && !bInDistrict) return -1;
                if (!aInDistrict && bInDistrict) return 1;
            }

            // 2. Sort by query match position
            const query = schoolSearchQuery.toLowerCase();
            const aName = a.school_name.toLowerCase();
            const bName = b.school_name.toLowerCase();
            const aStarts = aName.startsWith(query);
            const bStarts = bName.startsWith(query);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aName.localeCompare(bName);
        }).slice(0, 15)
            .map(s => `${s.school_name} - ${s.address || s.district}`); // Format: School Name - Address/District

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSchoolDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const m = parseFloat(formData.marks12th.mathsAccs) || 0;
        const p = parseFloat(formData.marks12th.phyEco) || 0;
        const c = parseFloat(formData.marks12th.cheComm) || 0;

        if (m || p || c) {
            const cutoff = (m + (p / 2) + (c / 2)).toFixed(2);
            if (formData.marks12th.cutoff !== cutoff) {
                setFormData(prev => ({
                    ...prev,
                    marks12th: { ...prev.marks12th, cutoff }
                }));
            }
        }
    }, [formData.marks12th.mathsAccs, formData.marks12th.phyEco, formData.marks12th.cheComm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        const appNo = `APP-${year}-${random}`;

        const newData = {
            ...formData,
            appNumber: appNo,
            studentUsername: user.username,
            status: 'Pending'
        };

        try {
            const response = await fetch('http://localhost:5000/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (response.ok) {
                setSubmittedAppNumber(appNo);
                // Also keep localStorage as a backup or for other components if needed, optional
                const existingData = JSON.parse(localStorage.getItem('admissions') || '[]');
                localStorage.setItem('admissions', JSON.stringify([...existingData, { ...newData, id: Date.now() }]));
            } else {
                alert('Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Server error. Please check if the backend is running.');
        }
    };

    if (submittedAppNumber) {
        return (
            <div className="container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Save size={40} color="var(--success)" />
                    </div>
                    <h2 className="font-outfit" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Submission Successful!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your application has been received and is under review.</p>

                    <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed var(--primary)', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Application Number</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>{submittedAppNumber}</div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Please save this number for future reference.</p>

                    <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ width: '100%' }}>
                        Fill Another Form
                    </button>
                    <button onClick={onLogout} className="btn" style={{ width: '100%', marginTop: '1rem', background: 'var(--glass-bg)' }}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'rgba(255, 255, 255, 0.3)' }}>
            {/* Navigation Header */}
            <nav style={{
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.4rem', borderRadius: '0.5rem' }}>
                        <GraduationCap size={20} />
                    </div>
                    <h2 className="font-outfit" style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)', fontWeight: '700' }}>KG-Admission</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.location.href = '/'} className="btn" style={{ background: 'var(--glass-bg)', fontSize: '0.9rem' }}>
                        ← Back to Home
                    </button>
                    {user && user.role !== 'Guest' && (
                        <button onClick={onLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', fontSize: '0.9rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    )}
                </div>
            </nav>

            <div className="container animate-fade-in" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 className="font-outfit" style={{ fontSize: '2.5rem', background: 'linear-gradient(to right, var(--primary), #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                        Admission Enquiry Form
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join our community of learners and innovators.</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '3rem' }}>
                    {/* Section 1: Basic Info */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            <FileText size={24} color="var(--primary)" />
                            <h3 className="font-outfit" style={{ fontSize: '1.5rem' }}>Basic Registration Details</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Date</label>
                                <input type="date" name="date" className="input-field" value={formData.date} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Institution</label>
                                <select name="institution" className="input-field" value={formData.institution} onChange={handleChange}>
                                    <option value="">Select Institution</option>
                                    <option value="KITE">KITE - KGiSL Institute of Technology</option>
                                    <option value="KGCAS">KGCAS - KG College of Arts & Science</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Course</label>
                                <input type="text" name="course" className="input-field" placeholder="E.g. B.E CSE, B.Sc IT" value={formData.course} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Student Details */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            <ClipboardList size={24} color="var(--primary)" />
                            <h3 className="font-outfit" style={{ fontSize: '1.5rem' }}>Personal Information</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Student Name</label>
                                <input type="text" name="studentName" className="input-field" value={formData.studentName} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Gender</label>
                                <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Date of Birth</label>
                                <input type="date" name="dob" className="input-field" value={formData.dob} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Aadhaar Number</label>
                                <input type="text" name="aadhaarNo" className="input-field" value={formData.aadhaarNo} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Quota</label>
                                <select name="quota" className="input-field" value={formData.quota} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Management">Management Quota</option>
                                    <option value="Government">Government Quota (TNEA)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Community</label>
                                <input type="text" name="community" className="input-field" placeholder="OC/BC/BCM/MBC/SC/ST" value={formData.community} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">District</label>
                                <input type="text" name="district" className="input-field" placeholder="E.g. Coimbatore" value={formData.district} onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Annual Income</label>
                                <input type="text" name="annualIncome" className="input-field" placeholder="Rs." value={formData.annualIncome} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Pincode</label>
                                <input type="text" name="pincode" className="input-field" value={formData.pincode} onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Phone 1 (Student WA)</label>
                                <input type="text" name="phone1" className="input-field" value={formData.phone1} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone 2 (Parent WA)</label>
                                <input type="text" name="phone2" className="input-field" value={formData.phone2} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone 3 (Alternative)</label>
                                <input type="text" name="phone3" className="input-field" value={formData.phone3} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Permanent Address</label>
                            <textarea name="address" className="input-field" style={{ minHeight: '80px' }} value={formData.address} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    {/* Section 3: Academic Details */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            <GraduationCap size={24} color="var(--primary)" />
                            <h3 className="font-outfit" style={{ fontSize: '1.5rem' }}>Academic Background</h3>
                        </div>

                        <div className="input-group" style={{ position: 'relative' }} ref={dropdownRef}>
                            <label className="input-label">School Name & Place</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Search or type school name..."
                                    value={schoolSearchQuery}
                                    onChange={(e) => {
                                        setSchoolSearchQuery(e.target.value);
                                        setFormData(prev => ({ ...prev, schoolName: e.target.value }));
                                        setShowSchoolDropdown(true);
                                        setSelectedIndex(-1);
                                    }}
                                    onFocus={() => setShowSchoolDropdown(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowDown') {
                                            e.preventDefault();
                                            setSelectedIndex(prev => (prev < filteredSchools.length - 1 ? prev + 1 : prev));
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
                                        } else if (e.key === 'Enter' && selectedIndex >= 0) {
                                            e.preventDefault();
                                            const school = filteredSchools[selectedIndex];
                                            setFormData(prev => ({ ...prev, schoolName: school }));
                                            setSchoolSearchQuery(school);
                                            setShowSchoolDropdown(false);
                                        } else if (e.key === 'Escape') {
                                            setShowSchoolDropdown(false);
                                        }
                                    }}
                                />
                                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem', alignItems: 'center', pointerEvents: 'none' }}>
                                    {schoolSearchQuery && (
                                        <X
                                            size={16}
                                            color="var(--text-muted)"
                                            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSchoolSearchQuery('');
                                                setFormData(prev => ({ ...prev, schoolName: '' }));
                                            }}
                                        />
                                    )}
                                    <Search size={18} color="var(--text-muted)" />
                                    <ChevronDown size={14} color="var(--text-muted)" />
                                </div>
                            </div>

                            {showSchoolDropdown && schoolSearchQuery.trim() !== '' && (
                                <div className="glass-card" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    zIndex: 100,
                                    marginTop: '0.5rem',
                                    maxHeight: '250px',
                                    overflowY: 'auto',
                                    padding: '0.5rem',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                                    background: 'var(--card-bg, #fff)'
                                }}>
                                    {filteredSchools.length > 0 ? (
                                        filteredSchools.map((school, index) => {
                                            const query = schoolSearchQuery.toLowerCase();
                                            const startIndex = school.toLowerCase().indexOf(query);
                                            const before = school.slice(0, startIndex);
                                            const match = school.slice(startIndex, startIndex + query.length);
                                            const after = school.slice(startIndex + query.length);

                                            return (
                                                <div
                                                    key={index}
                                                    className="dropdown-item"
                                                    style={{
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        background: selectedIndex === index ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem'
                                                    }}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, schoolName: school }));
                                                        setSchoolSearchQuery(school);
                                                        setShowSchoolDropdown(false);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                >
                                                    <School size={16} color="var(--primary)" />
                                                    <span style={{ fontSize: '0.9rem' }}>
                                                        {before}
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{match}</span>
                                                        {after}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            No schools found matching "<b>{schoolSearchQuery}</b>"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">School Type</label>
                                <select name="schoolType" className="input-field" value={formData.schoolType} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Private">Private</option>
                                    <option value="Govt">Govt. School</option>
                                    <option value="Aided">Govt. Aided</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Board</label>
                                <select name="boardOfStudy" className="input-field" value={formData.boardOfStudy} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="State">State Board</option>
                                    <option value="CBSE">CBSE</option>
                                    <option value="ICSE">ICSE</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Medium</label>
                                <input type="text" name="mediumOfInstruction" className="input-field" placeholder="English/Tamil" value={formData.mediumOfInstruction} onChange={handleChange} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ margin: '1rem 0', color: 'var(--primary)' }}>10th Std Marks</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Total</label>
                                    <input type="number" className="input-field" value={formData.marks10th.total} onChange={(e) => handleNestedChange('marks10th', 'total', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Maths</label>
                                    <input type="number" className="input-field" value={formData.marks10th.maths} onChange={(e) => handleNestedChange('marks10th', 'maths', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Science</label>
                                    <input type="number" className="input-field" value={formData.marks10th.science} onChange={(e) => handleNestedChange('marks10th', 'science', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ margin: '1rem 0', color: 'var(--primary)' }}>11th Std Marks</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Total</label>
                                    <input type="number" className="input-field" value={formData.marks11th.total} onChange={(e) => handleNestedChange('marks11th', 'total', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Phy/Eco</label>
                                    <input type="number" className="input-field" value={formData.marks11th.phyEco} onChange={(e) => handleNestedChange('marks11th', 'phyEco', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Che/Comm</label>
                                    <input type="number" className="input-field" value={formData.marks11th.cheComm} onChange={(e) => handleNestedChange('marks11th', 'cheComm', e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Comp/Bio</label>
                                    <input type="number" className="input-field" value={formData.marks11th.compBio} onChange={(e) => handleNestedChange('marks11th', 'compBio', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary)' }}>12th Std Marks</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem' }}>
                            <div className="input-group">
                                <label className="input-label">Total</label>
                                <input type="number" className="input-field" value={formData.marks12th.total} onChange={(e) => handleNestedChange('marks12th', 'total', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Maths/Accs</label>
                                <input type="number" className="input-field" value={formData.marks12th.mathsAccs} onChange={(e) => handleNestedChange('marks12th', 'mathsAccs', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phy/Eco</label>
                                <input type="number" className="input-field" value={formData.marks12th.phyEco} onChange={(e) => handleNestedChange('marks12th', 'phyEco', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Che/Comm</label>
                                <input type="number" className="input-field" value={formData.marks12th.cheComm} onChange={(e) => handleNestedChange('marks12th', 'cheComm', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Comp/Bio</label>
                                <input type="number" className="input-field" value={formData.marks12th.compBio} onChange={(e) => handleNestedChange('marks12th', 'compBio', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Reg No.</label>
                                <input type="text" className="input-field" value={formData.marks12th.regNo} onChange={(e) => handleNestedChange('marks12th', 'regNo', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label" style={{ color: 'var(--primary)' }}>Cutoff</label>
                                <input type="text" className="input-field" value={formData.marks12th.cutoff} readOnly style={{ background: 'rgba(56, 189, 248, 0.1)', cursor: 'not-allowed', color: 'var(--primary)', fontWeight: 'bold' }} />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Facilities */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            <Calculator size={24} color="var(--primary)" />
                            <h3 className="font-outfit" style={{ fontSize: '1.5rem' }}>Other Requirements</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Hostel Required?</label>
                                <select name="hostel" className="input-field" value={formData.hostel} onChange={handleChange}>
                                    <option value="NO">No</option>
                                    <option value="YES">Yes</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">College Bus?</label>
                                <select name="bus" className="input-field" value={formData.bus} onChange={handleChange}>
                                    <option value="NO">No</option>
                                    <option value="YES">Yes</option>
                                </select>
                            </div>
                            {formData.bus === 'YES' && (
                                <div className="input-group">
                                    <label className="input-label">Bus Boarding Point</label>
                                    <input type="text" name="busPoint" className="input-field" value={formData.busPoint} onChange={handleChange} />
                                </div>
                            )}
                            <div className="input-group">
                                <label className="input-label">First Grad Scholarship?</label>
                                <select name="firstGrad" className="input-field" value={formData.firstGrad} onChange={handleChange}>
                                    <option value="NO">No</option>
                                    <option value="YES">Yes</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">PMSS Scholarship?</label>
                                <select name="pmss" className="input-field" value={formData.pmss} onChange={handleChange}>
                                    <option value="NO">No</option>
                                    <option value="YES">Yes</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Own Laptop?</label>
                                <select name="laptop" className="input-field" value={formData.laptop} onChange={handleChange}>
                                    <option value="NO">No</option>
                                    <option value="YES">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
                        <Save size={20} /> Submit Admission Application
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdmissionForm;
