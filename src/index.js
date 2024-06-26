import app from "./app.js";
import "./database.js";
import { createTables, deleteUser, insertUser } from "./database.js";

app.listen(3000);
console.log("Server on port", 3000);
createTables();
insertUser("alvaro","alvaro@gmail.com",1234);
insertUser("juan","juan@gmail.com",1234);
insertUser("isma","isma@gmail.com",1234);
deleteUser("alvaro"); //Funciona si al hacer localhost:3000/users no aparece alvaro
