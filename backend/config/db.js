const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected...');
    
    // Initialize tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE,
        email VARCHAR(255) UNIQUE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        pickup VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        fare FLOAT NOT NULL,
        status VARCHAR(50) DEFAULT 'requested',
        ride_type VARCHAR(50) DEFAULT 'economy',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
  } catch (err) {
    console.error('PostgreSQL Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.pool = pool;
