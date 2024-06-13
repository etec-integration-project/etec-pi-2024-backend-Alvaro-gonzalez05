import express from "express";
import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

const app = express();

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: 3307,
    database: process.env.MYSQLDB_DATABASE
});

// Función para crear tablas
const createTables = async () => {
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
                quantity INT NOT NULL
            );
        `);

        console.log("Tables created successfully.");
        connection.release();
    } catch (err) {
        console.error("Error creating tables:", err);
    }
};

// Crear tablas al iniciar el servidor
setTimeout(createTables, 200); // Esperar 20 segundos antes de intentar crear las tablas

const insertUser = async (username, email, password) => {
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

insertUser('alvaro', 'alva@example.com', '123456');





app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/ping", async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
