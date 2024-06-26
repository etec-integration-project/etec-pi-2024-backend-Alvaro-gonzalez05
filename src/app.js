import express from "express";
import { pool } from "./database.js";

const app = express();

app.get("/ping", async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT NOW() as now`);
    return res.json(result[0]);
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    // Consulta para obtener todos los usuarios de la tabla 'usuarios'
    const [rows] = await pool.query(`
      SELECT username, email 
      FROM usuarios;
    `);

    // Devolver los usuarios en formato JSON
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    // En caso de error, devolver una respuesta con el código de estado 500
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default app;


