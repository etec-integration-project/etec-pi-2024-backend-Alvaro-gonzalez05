import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

export const pool = createPool({
  port: "3306",
  host: process.env.MYSQLDB_HOST,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
});

pool.on("connection", () => console.log("DB Connected!"));

//Funcion para crear tablas
export const createTables = async () => {
  try {
      const connection = await pool.getConnection();
      await connection.query(`
          CREATE TABLE IF NOT EXISTS usuarios (
              id INT AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              contraseña VARCHAR(255) NOT NULL
          );
      `);

      await connection.query(`
          CREATE TABLE IF NOT EXISTS products (
              id INT AUTO_INCREMENT PRIMARY KEY,
              product VARCHAR(255) NOT NULL,
              price VARCHAR(255) NOT NULL,
              quantity INT NOT NULL
              
          );
      `);

      console.log("Tables created successfully.");
      connection.release();
  } catch (err) {
      console.error("Error creating tables:", err);
  }
};

//Funcion para Insertar usuarios
export const insertUser = async (username, email, password) => {
  try {
      const connection = await pool.getConnection();

      // Utilizar parámetros para evitar inyección SQL
      const query = `
          INSERT INTO usuarios (username, email, contraseña)
          VALUES (?, ?, ?);
      `;

      // Ejecución de la consulta
      await connection.query(query, [username, email, password]);

      console.log("User inserted successfully.");
      connection.release();
  } catch (err) {
      console.error("Error inserting user:", err);
  }
};

//Funcion que borra usuarios
export const deleteUser = async (username) => {
  try {
      const connection = await pool.getConnection();

      // Utilizar parámetros para evitar inyección SQL
      const query = `
          DELETE FROM usuarios
          WHERE username = ?;
      `;

      // Ejecución de la consulta
      await connection.query(query, [username]);

      console.log("User deleted successfully.");
      connection.release();
  } catch (err) {
      console.error("Error deleting user:", err);
  }
};