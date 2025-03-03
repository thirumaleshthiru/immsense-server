import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'srv1752.hstgr.io',
    user: 'u607585719_class',
    password: 'Immese@79',
    database: 'u607585719_class',
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0
});

export default pool;
