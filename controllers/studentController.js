import pool from '../db/db.js';

const getStatistics = async (req, res) => {
    try {
        const { student_id } = req.params;

        // Fetch student's branch, year, and section
        const [studentInfo] = await pool.query(
            'SELECT student_branch, student_year, student_section FROM students WHERE student_id = ?',
            [student_id]
        );

        if (studentInfo.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        const { student_branch, student_year, student_section } = studentInfo[0];

        // Get total available classes based on student's branch, year, and section
        const [totalClasses] = await pool.query(
            `SELECT COUNT(*) AS total_actual_classes FROM recorded_classes 
             WHERE class_for_branch = ? AND class_for_year = ? AND class_for_section = ?`,
            [student_branch, student_year, student_section]
        );

        // Get attended classes count
        const [attendedClasses] = await pool.query(
            `SELECT COUNT(*) AS total_classes_attended 
             FROM attendance a 
             JOIN recorded_classes rc ON a.class_id = rc.class_id
             WHERE a.student_id = ? AND a.is_present = true
             AND rc.class_for_branch = ? AND rc.class_for_year = ? AND rc.class_for_section = ?`,
            [student_id, student_branch, student_year, student_section]
        );

        const total_actual_classes = totalClasses[0]?.total_actual_classes || 0;
        const total_classes_attended = attendedClasses[0]?.total_classes_attended || 0;
        const percentage = total_actual_classes > 0 ? (total_classes_attended / total_actual_classes) * 100 : 0;

        res.json({ total_classes_attended, total_actual_classes, percentage: percentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const giveAttendance = async (req, res) => {
    try {
        const { student_id, class_id } = req.body;

        // Insert attendance record if not already present
        await pool.query(
            'INSERT IGNORE INTO attendance (student_id, class_id, is_present) VALUES (?, ?, 0)',
            [student_id, class_id]
        );

        // Update attendance record
        const [result] = await pool.query(
            'UPDATE attendance SET is_present = 1 WHERE student_id = ? AND class_id = ?',
            [student_id, class_id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Attendance record not found." });
        }

        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getStatistics, giveAttendance };
