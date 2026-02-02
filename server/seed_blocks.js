import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILE = path.join(__dirname, '../school_block_data.xlsx');
const DB_FILE = path.join(__dirname, 'admission_enquiry.db');

async function seedBlocks() {
    try {
        console.log(`Reading Excel file from: ${EXCEL_FILE}`);
        const workbook = xlsx.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        // Assuming headers are not present in the first row based on my python script (header=False)
        // But let's check. My python script had: df.to_excel(excel_path, index=False, header=False)
        // So row 1 is data.
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        if (data.length === 0) {
            console.log('No data found in Excel file.');
            return;
        }

        console.log(`Found ${data.length} rows. Connecting to database...`);
        const db = await open({
            filename: DB_FILE,
            driver: sqlite3.Database
        });

        // Drop existing table and recreate with new schema
        await db.exec(`
            DROP TABLE IF EXISTS school_blocks;
            
            CREATE TABLE school_blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                district TEXT,
                block_name TEXT,
                school_name TEXT,
                address TEXT,
                pincode TEXT
            );
        `);

        console.log('Table recreated with new schema.');

        console.log('Inserting data...');
        const stmt = await db.prepare('INSERT INTO school_blocks (district, block_name, school_name, address, pincode) VALUES (?, ?, ?, ?, ?)');

        await db.run('BEGIN TRANSACTION');

        let insertedCount = 0;

        for (const row of data) {
            // Row structure: [S.No, District, Block Name, School Name, Address, Pincode]
            // Skip header row
            if (row.length >= 6 && row[0] !== 'S NO') {
                const district = row[1];
                const blockName = row[2];
                const schoolName = row[3];
                const address = row[4];
                const pincode = row[5];

                if (district && schoolName) {
                    try {
                        await stmt.run(
                            district.toString(),
                            blockName ? blockName.toString() : '',
                            schoolName.toString(),
                            address ? address.toString() : '',
                            pincode ? pincode.toString() : ''
                        );
                        insertedCount++;
                    } catch (err) {
                        // Silently skip duplicates
                    }
                }
            }
        }

        await db.run('COMMIT');
        await stmt.finalize();
        console.log(`Successfully inserted ${insertedCount} school blocks.`);
        await db.close();

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedBlocks();
