const pool = require("../models/db");

exports.createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;
  if (capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ message: "Capacity must be between 1 and 1000" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (title, datetime, location, capacity)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, datetime, location, capacity]
    );
    res.status(201).json({ eventId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getEventDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (event.rowCount === 0) return res.status(404).json({ message: "Event not found" });

    const users = await pool.query(`
      SELECT users.id, users.name, users.email
      FROM registrations
      JOIN users ON registrations.user_id = users.id
      WHERE event_id = $1
    `, [id]);

    res.json({ ...event.rows[0], registrations: users.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.registerForEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
    if (!event.rows.length) return res.status(404).json({ message: "Event not found" });

    const now = new Date();
    if (new Date(event.rows[0].datetime) < now)
      return res.status(400).json({ message: "Cannot register for past events" });

    const checkDup = await pool.query(
      `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );
    if (checkDup.rowCount) return res.status(400).json({ message: "Already registered" });

    const count = await pool.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id = $1`,
      [eventId]
    );

    if (parseInt(count.rows[0].count) >= event.rows[0].capacity)
      return res.status(400).json({ message: "Event is full" });

    await pool.query(`INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`, [
      userId,
      eventId,
    ]);

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  const { userId, eventId } = req.body;

  const result = await pool.query(
    `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *`,
    [userId, eventId]
  );

  if (result.rowCount === 0)
    return res.status(400).json({ message: "User was not registered for this event" });

  res.json({ message: "Registration cancelled" });
};

exports.listUpcomingEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM events
      WHERE datetime > NOW()
      ORDER BY datetime ASC, location ASC
      `
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No upcoming events." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    res.status(500).json({ message: "Failed to fetch upcoming events." });
  }
};


exports.eventStats = async (req, res) => {
  const { id } = req.params;

  const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
  if (!event.rows.length) return res.status(404).json({ message: "Event not found" });

  const capacity = event.rows[0].capacity;
  const reg = await pool.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1`, [id]);
  const count = parseInt(reg.rows[0].count);

  res.json({
    total_registrations: count,
    remaining_capacity: capacity - count,
    percent_filled: ((count / capacity) * 100).toFixed(2) + "%",
  });
};
