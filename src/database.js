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

pool.on('connection',()=> console.log("DB Connected..."));

//Funcion para crear tablas
export const createTables = async () => {
  try {
      const connection = await pool.getConnection();
      await connection.query(`
          CREATE TABLE IF NOT EXISTS usuarios (
              id INT AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL
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

//Funcion para insertar usuarios
export const insertUser = async (username, email, password) => {
  try {
      const connection = await pool.getConnection();

      // Utilizar parámetros para evitar inyección SQL
      const query = `
          INSERT INTO usuarios (username, email, password)
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

//Funcion update usuarios
export const updateUser = async (userId, username, email, password) => {
    try {
      // Obtener una conexión del pool
      const connection = await pool.getConnection();
  
      // Definir la consulta SQL con parámetros
      const query = `
        UPDATE usuarios
        SET username = ?, email = ?, password = ?
        WHERE id = ?;
      `;
  
      // Ejecutar la consulta con los valores proporcionados
      await connection.query(query, [username, email, password, userId]);
  
      console.log("User updated successfully.");
      
      // Liberar la conexión
      connection.release();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

//Funcion para agregar productos
export const insertProduct = async (product, price,quantity ) => {
    try {
        const connection = await pool.getConnection();
  
        // Utilizar parámetros para evitar inyección SQL
        const query = `
            INSERT INTO products (product, price, quantity)
            VALUES (?, ?, ?);
        `;
  
        // Ejecución de la consulta
        await connection.query(query, [product, price, quantity]);
  
        console.log("Product inserted successfully.");
        connection.release();
    } catch (err) {
        console.error("Error inserting Product:", err);
    }
  };

//Funcion para eliminar productos
export const deleteProduct = async (product) => {
    try {
        const connection = await pool.getConnection();
  
        // Utilizar parámetros para evitar inyección SQL
        const query = `
            DELETE FROM products
            WHERE product = ?;
        `;
  
        // Ejecución de la consulta
        await connection.query(query, [product]);
  
        console.log("User deleted successfully.");
        connection.release();
    } catch (err) {
        console.error("Error deleting user:", err);
    }
  };

//Funcion update productos
export const updateProduct = async (productId, product, price, quantity) => {
    try {
      // Obtener una conexión del pool
      const connection = await pool.getConnection();
  
      // Definir la consulta SQL con parámetros
      const query = `
        UPDATE products
        SET product = ?, price = ?, quantity = ?
        WHERE id = ?;
      `;
  
      // Ejecutar la consulta con los valores proporcionados
      await connection.query(query, [product, price, quantity, productId]);
  
      console.log("User updated successfully.");
      
      // Liberar la conexión
      connection.release();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };