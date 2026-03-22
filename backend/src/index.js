const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// GET ALL PEOPLE
app.get("/api/people", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM people ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

// GET SINGLE PERSON
app.get("/api/people/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "INVALID_ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM people WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("GET BY ID ERROR:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

// CREATE PERSON
app.post("/api/people", async (req, res) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ error: "MISSING_FIELDS" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "INVALID_EMAIL" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *",
      [full_name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

// UPDATE PERSON
app.put("/api/people/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { full_name, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "INVALID_ID" });
  }

  if (!full_name || !email) {
    return res.status(400).json({ error: "MISSING_FIELDS" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "INVALID_EMAIL" });
  }

  try {
    const result = await pool.query(
      "UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *",
      [full_name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("PUT ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
    }

    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

// DELETE PERSON
app.delete("/api/people/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "INVALID_ID" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM people WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "PERSON_NOT_FOUND" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 