const express = require("express");
const { createPool } = require("./db");

const app = express();
app.use(express.json());

let pool;

// Health de la API (simple)
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "app" });
});

// Health con DB (comprueba conexión real)
app.get("/db-health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: rows[0].ok });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Crea tabla y mete un registro de prueba
app.post("/init", async (req, res) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query("INSERT INTO notes (text) VALUES (?)", ["Hola desde Docker + MySQL"]);
  res.json({ ok: true, message: "Tabla creada e inserción lista" });
});

// Lista registros
app.get("/notes", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM notes ORDER BY id DESC");
  res.json(rows);
});

const PORT = 3000;

(async () => {
  // Espera a que exista el pool (db ya estará healthy por depends_on)
  pool = await createPool();

  app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
  });
})();
