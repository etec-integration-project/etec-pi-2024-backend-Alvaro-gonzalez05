import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

export const pool = createPool({
  port: "3306",
  host: process.env.MYSQLDB_HOST,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  multipleStatements: true

});

pool.on('connection',()=> console.log("DB Connected..."));



//Funcion que crea la base de datos
export const createDatabases = async () => {
  try {
      const connection = await pool.getConnection();
      await connection.query(`
          DROP DATABASE IF EXISTS ecommerce;
          CREATE DATABASE ecommerce;
          USE ecommerce;
          CREATE USER 'alva'@'%' IDENTIFIED BY 'soyyo';
          GRANT ALL PRIVILEGES ON ecommerce.* TO 'alva'@'%';
          FLUSH PRIVILEGES;



      `);

      

      console.log("Databases created successfully.");
      connection.release();
  } catch (err) {
      console.error("Error creating Databases:", err);
  }
};


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
            img VARCHAR(500) NOT NULL,               -- Campo para la URL de la imagen
            nameProduct VARCHAR(255) NOT NULL,       -- Nombre del producto
            price DECIMAL(10, 2) NOT NULL,           -- Precio con decimales
            quantity INT NOT NULL                    -- Cantidad
        );
    `);
    await connection.query(`
      INSERT IGNORE INTO products (img, nameProduct, price, quantity) VALUES
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-06/WW_IG-FB_VL_BaristaCreations_BlackIced_BlackCurrant_2019-2029.jpg', 'Lively Citrus Splash ', 3.00,1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-04/240325-Nespresso-cadiz-receta05-GISJ0591-Mejorado-NR.jpg', 'Café Moca con Crema', 3.50, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-06/WW_IG-FB_VL_BaristaCreations_IcedLatte_SaltedCaramel_2019-2029.jpg', 'Ice Caramel Latte', 4.00, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-04/receta_vertuo_reverso_1%20-%20copia_0.jpg', 'Capuchino Caramel', 3.75, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-04/240325-Nespresso-cadiz-receta07-GISJ1119-Mejorado-NR.jpg', 'Expresso Almendrado', 2.50, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2023-11/merry-marshmallow-latte_portrait_primary_d_2x_0.jpg', 'Merry Marshmallow', 2.00, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-05/receta_vertuo_PH_raspberry_mocktail_v1%20-%20copia.jpg', 'Rasberry Moca', 2.50, 1),
      ('https://www.nespresso.com/coffee-blog/sites/default/files/2024-05/receta_original_espresso_macchiato_1%20-%20copia.jpg', 'Expresso Machiatto', 5.00, 1);
  `);
  
    
      await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            total_price DECIMAL(10, 2) NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            products JSON NOT NULL
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
          INSERT IGNORE INTO usuarios (username, email, password)
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
export const insertProduct = async (nameProduct, price,quantity ) => {
    try {
        const connection = await pool.getConnection();
  
        // Utilizar parámetros para evitar inyección SQL
        const query = `
            INSERT INTO products (nameProduct, price, quantity)
            VALUES (?, ?, ?);
        `;
  
        // Ejecución de la consulta
        await connection.query(query, [nameProduct, price, quantity]);
  
        console.log("Product inserted successfully.");
        connection.release();
    } catch (err) {
        console.error("Error inserting Product:", err);
    }
  };

//Funcion para eliminar productos
export const deleteProduct = async (nameProduct) => {
    try {
        const connection = await pool.getConnection();
  
        // Utilizar parámetros para evitar inyección SQL
        const query = `
            DELETE FROM products
            WHERE nameProduct = ?;
        `;
  
        // Ejecución de la consulta
        await connection.query(query, [nameProduct]);
  
        console.log("User deleted successfully.");
        connection.release();
    } catch (err) {
        console.error("Error deleting user:", err);
    }
  };

//Funcion update productos
export const updateProduct = async (productId, nameProduct, price, quantity) => {
    try {
      // Obtener una conexión del pool
      const connection = await pool.getConnection();
  
      // Definir la consulta SQL con parámetros
      const query = `
        UPDATE products
        SET nameProduct = ?, price = ?, quantity = ?
        WHERE id = ?;
      `;
  
      // Ejecutar la consulta con los valores proporcionados
      await connection.query(query, [nameProduct, price, quantity, productId]);
  
      console.log("User updated successfully.");
      
      // Liberar la conexión
      connection.release();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };