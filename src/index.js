import app from "./app.js";
import "./database.js";
import { createTables, insertUser } from "./database.js";

app.listen(3000);
console.log("Server on port", 3000);
createTables();
insertUser("alvaro","alvaro@gmail.com",1234);