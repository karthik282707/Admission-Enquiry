import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let db;

// Initialize Database
(async () => {
    try {
        db = await open({
            filename: './admission_enquiry.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                appNumber TEXT UNIQUE,
                studentName TEXT,
                date TEXT,
                institution TEXT,
                course TEXT,
                phone1 TEXT,
                status TEXT,
                fullData JSON,
                submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS school_blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                district TEXT,
                block_name TEXT,
                school_name TEXT,
                address TEXT,
                pincode TEXT
            );
        `);
        console.log('Connected to SQLite database.');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
})();

// API: Submit Enquiry
app.post('/api/enquiries', async (req, res) => {
    try {
        const { appNumber, studentName, date, institution, course, phone1, status, ...rest } = req.body;

        await db.run(
            `INSERT INTO enquiries (appNumber, studentName, date, institution, course, phone1, status, fullData) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [appNumber, studentName, date, institution, course, phone1, status, JSON.stringify(req.body)]
        );

        res.status(201).json({ message: 'Enquiry submitted successfully', appNumber });
    } catch (error) {
        console.error('Error saving enquiry:', error);
        res.status(500).json({ error: 'Failed to save enquiry' });
    }
});

// API: Get All Enquiries (For testing/admin)
app.get('/api/enquiries', async (req, res) => {
    try {
        const enquiries = await db.all('SELECT * FROM enquiries ORDER BY submittedAt DESC');
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// API: Get School Blocks
app.get('/api/school-blocks', async (req, res) => {
    try {
        // Use DISTINCT to avoid showing duplicate entries
        const blocks = await db.all(`
            SELECT DISTINCT district, block_name, school_name, address, pincode
            FROM school_blocks 
            WHERE school_name IS NOT NULL AND school_name != ''
            ORDER BY district ASC, school_name ASC
        `);
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching school blocks:', error);
        res.status(500).json({ error: 'Failed to fetch school blocks' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
