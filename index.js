const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rin1234",
  database: "todo_db",
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("DB接続エラー:", err);
    return;
  }
  console.log("MySQLに接続しました！");
});

app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/todos", (req, res) => {
  db.query(
    "INSERT INTO todos (text) VALUES (?)",
    [req.body.text],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, text: req.body.text, done: false });
    },
  );
});

app.patch("/todos/:id", (req, res) => {
  db.query(
    "UPDATE todos SET done = NOT done WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    },
  );
});

app.delete("/todos/:id", (req, res) => {
  db.query("DELETE FROM todos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
