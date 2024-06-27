import app from "./app.js";

import { createTables, deleteUser, insertUser,updateUser,insertProduct,deleteProduct,updateProduct } from "./database.js";


app.listen(3000);

console.log("Server on port", 3000);
createTables();
//Funciones de usuarios
insertUser("alvaro","alvaro@gmail.com",1234);
insertUser("juan","juan@gmail.com",1234);
insertUser("isma","isma@gmail.com",1234);
deleteUser("alvaro"); //Al hacer localhost:3000/users no aparece alvaro.
updateUser(2, "newUsername", "newEmail@gmail.com", "newPassword"); //El elemento con el id 2 tendra estos valores.


//Funciones de productos
insertProduct("Iphone 13",500,4);
insertProduct("Iphone 14",650,5);
deleteProduct("Iphone 13")
updateProduct(1,"iphone 14 pro max",700,2)




