const { pool } = require('./db');
const seed = async () => {
    try {
        await pool.query(`INSERT INTO users (username, email, password, role) VALUES ('Dr. Mentor', 'mentor@health.com', '123456', 'mentor') ON CONFLICT DO NOTHING;`);
        console.log("Mentor seeded.");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
};
seed();
