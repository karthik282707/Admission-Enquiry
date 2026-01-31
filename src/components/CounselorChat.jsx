import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, History, Search, Info } from 'lucide-react';

const CounselorChat = ({ user }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Counsel Assistant. You can look up a student by typing their application number (e.g., '123' or 'Lookup 123').", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [admissions, setAdmissions] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('admissions') || '[]');
        setAdmissions(data);
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        processCommand(inputValue);
        setInputValue('');
    };

    const processCommand = (text) => {
        const query = text.trim();
        const lowerQuery = query.toLowerCase();

        // 1. Try exact match first
        let student = admissions.find(a =>
            (a.appNumber && a.appNumber.toLowerCase() === lowerQuery) ||
            (a.id && a.id.toString() === query) ||
            (a.studentName && a.studentName.toLowerCase() === lowerQuery)
        );

        // 2. If no exact match, try to extract pattern
        if (!student) {
            const appNoMatch = query.match(/APP-\d{4}-\d{4}/i) || query.match(/\d+/);
            const searchVal = appNoMatch ? appNoMatch[0].toLowerCase() : lowerQuery;

            student = admissions.find(a =>
                (a.appNumber && a.appNumber.toLowerCase().includes(searchVal)) ||
                (a.studentName && a.studentName.toLowerCase().includes(searchVal))
            );
        }

        if (student) {
            setSelectedStudent(student);
            const comments = JSON.parse(localStorage.getItem(`comments_${student.appNumber || student.id}`) || '[]');

            let responseText = `I found student details for ${student.studentName}:\n\n- Course: ${student.course}\n- Institution: ${student.institution}\n- Status: ${student.status}`;

            if (comments.length > 0) {
                responseText += `\n\nPrevious Comments found:`;
                comments.forEach(c => {
                    responseText += `\n• ${c.text} (by ${c.author} on ${new Date(c.date).toLocaleDateString()})`;
                });
            } else {
                responseText += `\n\nNo previous comments found. You can add a comment by typing 'comment: your message'.`;
            }

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: responseText,
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'details',
                    data: student
                }]);
            }, 500);
        } else if (lowerQuery.startsWith('comment:') || (selectedStudent && !lowerQuery.includes('lookup'))) {
            if (!selectedStudent) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "Please look up a student first before adding a comment.",
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }, 500);
                return;
            }

            const commentText = lowerQuery.startsWith('comment:') ? text.substring(8).trim() : text;
            const newComment = {
                text: commentText,
                author: user.username,
                date: new Date().toISOString()
            };

            const studentKey = `comments_${selectedStudent.appNumber || selectedStudent.id}`;
            const existingComments = JSON.parse(localStorage.getItem(studentKey) || '[]');
            localStorage.setItem(studentKey, JSON.stringify([...existingComments, newComment]));

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: `Comment saved for ${selectedStudent.studentName}: "${commentText}"`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }, 500);
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: `Sorry, I couldn't find any student matching "${text}". Try entering the full application number or student name.`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }, 500);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.5rem', borderRadius: '0.75rem' }}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="font-outfit" style={{ fontSize: '1.25rem', margin: 0 }}>Counsel Assistant</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>AI-Powered Student Support</p>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '1rem',
                                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--glass-bg)',
                                color: msg.sender === 'user' ? '#fff' : 'var(--text)',
                                border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                                borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                                borderBottomLeftRadius: msg.sender === 'user' ? '1rem' : '0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                whiteSpace: 'pre-line'
                            }}>
                                {msg.text}
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Type app number or a comment..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ flex: 1, margin: 0 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                        <Send size={20} />
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Search size={14} /> Search Student
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Info size={14} /> View Details
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <History size={14} /> Previous Comments
                </div>
            </div>
        </div>
    );
};

export default CounselorChat;
