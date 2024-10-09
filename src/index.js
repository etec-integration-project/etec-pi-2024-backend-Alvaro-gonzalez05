import app from "./app.js";

import { createTables, deleteUser, insertUser,updateUser,insertProduct,deleteProduct,updateProduct,createDatabases } from "./database.js";


app.listen(3000);

console.log("Server on port", 3000);
async function initializeDatabase() {
    try {
      await createDatabases();
      await createTables();  // Asegúrate de que esta función es asíncrona y retorna una promesa
  
      // Funciones de usuarios Pruebas
      await insertUser("alvaro", "alvaro@gmail.com", 1234);
      await insertUser("juan", "juan@gmail.com", 1234);
      await insertUser("isma", "isma@gmail.com", 1234);
      // await deleteUser("alvaro"); // Al hacer localhost:3000/users no aparece alvaro.
      // await updateUser(2, "newUsername", "newEmail@gmail.com", "newPassword"); // El elemento con el id 2 tendrá estos valores.
  
      // Funciones de productos Pruebas
      
  
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
  
  // Ejecuta la función para inicializar la base de datos
  initializeDatabase();


