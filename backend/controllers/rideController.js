const { pool } = require('../config/db');

// @desc Request new ride
exports.createRide = async (req, res) => {
  try {
    const { pickup, destination, fare, rideType } = req.body;
    const result = await pool.query(
      'INSERT INTO rides (user_id, pickup, destination, fare, ride_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, pickup, destination, fare, rideType || 'economy']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get ride history
exports.getRideHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rides WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
