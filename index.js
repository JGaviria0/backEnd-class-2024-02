import express from "express"
import { createClient } from "@libsql/client";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());

const { HOST_DB, USER_DB, PASSWORD_DB, DATABASE_DB, PORT_DB, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

// Create the connection to database
const connection = await mysql.createConnection({
  host: HOST_DB,
  user: USER_DB,
  password: PASSWORD_DB,
  database: DATABASE_DB,
  port: PORT_DB
});

const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

app.get('/', async(req, res) => {
  const ans2 = await turso.execute(`SELECT * FROM contacts`);
  const [ans, data] = await connection.query('SELECT * FROM contacts');
    console.log(ans);
    console.log(ans2);
    res.json({ ans })
})

app.get("/users", async(req, res) => {
    //"Select * from users"
    const ans = await turso.execute(`SELECT * FROM contacts`);
    console.log(ans);
    res.json( ans.rows )
});

app.post("/users", async(req, res) => {
    const {first_name, last_name, email, phone} = req.body;

    try {
      const ans = await turso.execute({
        sql: `INSERT INTO contacts ( first_name, last_name, email, phone) VALUES (?, ?, ?, ?)`,
        args: [first_name, last_name, email, phone]
      });
      res.json({
          mensaje: "Usuario creado",
          usuario: ans
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        mensaje: "Error al crear el usuario"
      });
    }
})

app.delete("/users/:id", (req, res) => {
    console.log(req.params.id); 

    // db = db.filter((user) => user.id != req.params.id);

    res.json({
        mensaje: "Usuario eliminado"
    });
});

// //todo: obtener un usuario por id

// // todo: Actualizar un usuario por id

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

