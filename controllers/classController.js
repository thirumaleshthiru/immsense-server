import pool from '../db/db.js';

const getClasses = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes JOIN teachers ON recorded_classes.class_by = teachers.teacher_id'
        );
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClassesByTeacherId = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes JOIN teachers ON recorded_classes.class_by = teachers.teacher_id WHERE class_by = ?',
            [teacher_id]
        );
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClassesByStudentId = async (req, res) => {
    try {
        const { student_id } = req.params;
        const connection = await pool.getConnection();
        const [student] = await connection.execute(
            'SELECT student_branch, student_year, student_section FROM students WHERE student_id = ?',
            [student_id]
        );
        if (student.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Student not found' });
        }
        const { student_branch, student_year, student_section } = student[0];
        const [rows] = await connection.execute(
            `SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes 
            JOIN teachers ON recorded_classes.class_by = teachers.teacher_id 
            WHERE class_for_branch = ? AND class_for_year = ? AND class_for_section = ?`,
            [student_branch, student_year, student_section]
        );
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClassById = async (req, res) => {
    try {
        const { class_id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes JOIN teachers ON recorded_classes.class_by = teachers.teacher_id WHERE class_id = ?',
            [class_id]
        );
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
const getLiveClasses = async (req, res) => {
    try {
        const { student_id } = req.params;
        const connection = await pool.getConnection();
        const [student] = await connection.execute(
            'SELECT student_branch, student_year, student_section FROM students WHERE student_id = ?', 
            [student_id]
        );
        if (student.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const { student_branch, student_year, student_section } = student[0];
        const [rows] = await connection.execute(
            `SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes 
            JOIN teachers ON recorded_classes.class_by = teachers.teacher_id 
            WHERE class_for_branch = ? AND class_for_year = ? AND class_for_section = ?
            AND class_end_date >= NOW()`,
            [student_branch, student_year, student_section]
        );
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPreviousClasses = async (req, res) => {
    try {
        const { student_id } = req.params;
        const connection = await pool.getConnection();
        const [student] = await connection.execute(
            'SELECT student_branch, student_year, student_section FROM students WHERE student_id = ?', 
            [student_id]
        );
        if (student.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const { student_branch, student_year, student_section } = student[0];
        const [rows] = await connection.execute(
            `SELECT recorded_classes.*, teachers.teacher_name FROM recorded_classes 
            JOIN teachers ON recorded_classes.class_by = teachers.teacher_id 
            WHERE class_for_branch = ? AND class_for_year = ? AND class_for_section = ?
            AND class_end_date < NOW()`,
            [student_branch, student_year, student_section]
        );
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getClasses, getClassesByTeacherId, getClassesByStudentId, getClassById, getLiveClasses, getPreviousClasses };
