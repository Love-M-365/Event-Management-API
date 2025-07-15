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

exports.registerUserToEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId)
    return res.status(400).json({ message: "userId and eventId are required." });

  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
    if (event.rowCount === 0) return res.status(404).json({ message: "Event not found" });

    const now = new Date();
    if (new Date(event.rows[0].datetime) < now)
      return res.status(400).json({ message: "Cannot register for past events" });

    const checkDup = await pool.query(
      `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );
    if (checkDup.rowCount > 0)
      return res.status(400).json({ message: "User already registered" });

    const count = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1`, [
      eventId,
    ]);
    if (parseInt(count.rows[0].count) >= event.rows[0].capacity)
      return res.status(400).json({ message: "Event is full" });

    await pool.query(`INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`, [
      userId,
      eventId,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};


exports.cancelUserRegistration = async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId)
    return res.status(400).json({ message: "userId and eventId are required." });

  try {
    const result = await pool.query(
      `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`,
      [userId, eventId]
    );

    if (result.rowCount === 0)
      return res.status(400).json({ message: "User was not registered for this event" });

    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling registration" });
  }
};
