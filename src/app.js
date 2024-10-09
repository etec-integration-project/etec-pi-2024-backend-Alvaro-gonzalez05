import express from "express";
import { pool } from "./database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors"; // Importa el paquete cors
const secretKey = 'clave_secreta_jwt'; // Define tu clave secreta aquí o en un archivo de configuración


const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3001', // Permite el acceso solo desde este origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita el uso de cookies y credenciales si es necesario
  optionsSuccessStatus: 204
}));

// Middleware para parsear JSON
app.use(express.json());



app.post("/orders", async (req, res) => {
  const { totalPrice, products } = req.body;

  // Extraer solo los nombres de los productos usando nameProduct
  const productNames = products.map(product => product.nameProduct);

  try {
      await pool.query(`
          CREATE TABLE IF NOT EXISTS orders (
              id INT AUTO_INCREMENT PRIMARY KEY,
              total_price DECIMAL(10, 2) NOT NULL,
              order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              products JSON NOT NULL
          );
      `);

      // Guardar solo los nombres de los productos
      const result = await pool.query(
          "INSERT INTO orders (total_price, products) VALUES (?, ?)",
          [totalPrice, JSON.stringify(productNames)]
      );

      res.status(201).json({ message: "Order saved successfully", orderId: result.insertId });
  } catch (error) {
      console.error("Error saving the order:", error);
      res.status(500).json({ error: "An error occurred while saving the order" });
  }
});




// Ruta para registrar un nuevo usuario
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Verifica si todos los campos están presentes
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    // Verifica si el usuario ya existe
    const [existingUser] = await pool.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    // Generar token JWT
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    // Enviar el token en la respuesta junto con el mensaje de éxito
    res.status(201).json({ message: "Usuario registrado con éxito", token: token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta para iniciar sesión
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token de autenticación
    const token = jwt.sign({ id: user.id, email: user.email }, "tu_secreto", {
      expiresIn: "1h",
    });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Obtener todos los productos
app.get("/products", async (req, res) => {
  try {
      const [rows] = await pool.query("SELECT id, nameProduct, price, img, quantity FROM products");
      res.json(rows);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
  }
});







export default app;
