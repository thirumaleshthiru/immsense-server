import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/db.js';

const studentRegister = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { student_name, email, student_branch, student_year, student_section, student_rollno, password } = req.body;
        
        const [existingStudent] = await connection.execute(
            'SELECT * FROM students WHERE email = ? OR student_rollno = ?', 
            [email, student_rollno]
        );
        
        if (existingStudent.length > 0) {
            return res.status(400).json({ message: 'Email or roll number already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            'INSERT INTO students (student_name, email, student_branch, student_year, student_section, student_rollno, password, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [student_name, email, student_branch, student_year, student_section, student_rollno, hashedPassword, 'student']
        );
        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

const studentLogin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { student_rollno, password } = req.body;

        const [rows] = await connection.execute('SELECT * FROM students WHERE student_rollno = ?', [student_rollno]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const student = rows[0];
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: student.student_id, type: 'student' }, 'pkc4', { expiresIn: '1h' });
        res.json({ token, id: student.student_id, role: student.type });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

const teacherRegister = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { teacher_name, email, teacher_role, password } = req.body;
        
        const [existingTeacher] = await connection.execute(
            'SELECT * FROM teachers WHERE email = ?', 
            [email]
        );
        
        if (existingTeacher.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            'INSERT INTO teachers (teacher_name, email, teacher_role, password, type) VALUES (?, ?, ?, ?, ?)',
            [teacher_name, email, teacher_role, hashedPassword, 'teacher']
        );
        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

const teacherLogin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { email, password } = req.body;

        const [rows] = await connection.execute('SELECT * FROM teachers WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const teacher = rows[0];
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: teacher.teacher_id, type: 'teacher' }, 'pkc4', { expiresIn: '1h' });
        res.json({ token, id: teacher.teacher_id, role: teacher.type });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

export { studentRegister, studentLogin, teacherRegister, teacherLogin };
