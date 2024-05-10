import express from "express";
import { createPool } from "mysql2/promise";
const app = express()
const pool= createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    port:3307

})
app.get('/',(req,res)=>{
    res.send('Hola Mundo')
})

app.get('/ping',async(req,res)=>{
    const result= await pool.query('SELECT NOW()')
    res.json(result[0])
})

app.listen(3000)
console.log('Servidor en el puerto',3000)