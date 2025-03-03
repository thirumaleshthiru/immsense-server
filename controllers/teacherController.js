import pool from '../db/db.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 587,
    secure: false,
    auth: {
        user: 'thirumalesh579@zohomail.in',
        pass: 'Lp37Y33WyKkN'
    }
});

const createClass = async (req, res) => {
    try {
        const { class_name, class_description, class_start_date, class_end_date, class_by, class_for_branch, class_for_year, class_for_section } = req.body;
        const class_video_url = req.file ? `/uploads/${req.file.filename}` : null;

        // Insert the new class into recorded_classes
        await pool.query(
            'INSERT INTO recorded_classes (class_name, class_description, class_start_date, class_end_date, class_video_url, class_by, class_for_branch, class_for_year, class_for_section) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [class_name, class_description, class_start_date, class_end_date, class_video_url, class_by, class_for_branch, class_for_year, class_for_section]
        );

        // Fetch students' emails
        const [students] = await pool.query(
            'SELECT email FROM students WHERE student_branch = ? AND student_year = ? AND student_section = ?',
            [class_for_branch, class_for_year, class_for_section]
        );

        // Send emails to all students
        if (students.length > 0) {
            const studentEmails = students.map(student => student.email).join(',');

            const mailOptions = {
                from: 'thirumalesh579@zohomail.in',
                to: studentEmails,
                subject: `New Class Available: ${class_name}`,
                text: `The class "${class_name}" is ready. Login with your credentials and mark your attendance.`
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ message: 'Class created and email notifications sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        await pool.query('DELETE FROM recorded_classes WHERE class_id = ?', [class_id]);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNotes = async (req, res) => {
    try {
        const { related_class, note_by, notes_name, notes_description } = req.body;
        const notes_url = req.file ? `/uploads/${req.file.filename}` : null;
        await pool.query(
            'INSERT INTO class_notes (related_class, note_by, notes_name, notes_description, notes_url) VALUES (?, ?, ?, ?, ?)',
            [related_class, note_by, notes_name, notes_description, notes_url]
        );
        res.status(201).json({ message: 'Notes created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteNotes = async (req, res) => {
    try {
        const { note_id } = req.params;
        await pool.query('DELETE FROM class_notes WHERE note_id = ?', [note_id]);
        res.json({ message: 'Notes deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const viewClassAttendance = async (req, res) => {
    try {
        const { class_id } = req.params;
        const [rows] = await pool.query(
            'SELECT a.*, s.student_name FROM attendance a JOIN students s ON a.student_id = s.student_id WHERE a.class_id = ?',
            [class_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClassAttendance = async (req, res) => {
    try {
        const { class_id, year, branch, section } = req.params;
        const [rows] = await pool.query(
            'SELECT s.student_id, s.student_name, a.is_present FROM students s LEFT JOIN attendance a ON s.student_id = a.student_id AND a.class_id = ? WHERE s.student_year = ? AND s.student_branch = ? AND s.student_section = ?',
            [class_id, year, branch, section]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const { class_id } = req.params;
        const [rows] = await pool.query(
            `SELECT s.student_id, s.student_name, s.student_rollno, 
                    COALESCE(a.is_present, 0) AS is_present 
             FROM students s 
             JOIN recorded_classes rc 
             ON s.student_year = rc.class_for_year 
             AND s.student_branch = rc.class_for_branch 
             AND s.student_section = rc.class_for_section 
             LEFT JOIN attendance a 
             ON s.student_id = a.student_id AND a.class_id = ? 
             WHERE rc.class_id = ?`,
            [class_id, class_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createClass, deleteClass, createNotes, deleteNotes, viewClassAttendance, getClassAttendance, getAllAttendance };
