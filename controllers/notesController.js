import pool from '../db/db.js';

const getAllNotesByTeacherID = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM class_notes WHERE note_by = ?', [teacher_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllNotesByClassID = async (req, res) => {
    try {
        const { class_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM class_notes WHERE related_class = ?', [class_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotes = async (req, res) => {
    try {
        const { note_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM class_notes WHERE note_id = ?', [note_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Notes not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getAllNotesByTeacherID, getAllNotesByClassID, getNotes };
