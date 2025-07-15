const pool = require("../models/db");

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email are required." });

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
      [name, email]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ message: "Email already exists." });
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
