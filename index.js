// Inicio do codigo
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const auth = require('./services/auth');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Olá mundo!" })
});
app.listen(3000);
// app.use(cors());

//Configurando Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rotas
app.get("/", auth.checkToken, function (req, res) {
    console.log("Request:", req);
    res.status(200).json({ message: "Bem vindo!" });
});

// const userRouter = require("./routes/userRouter");

// app.use(userRouter);

// //Banco de Dados
// // const DB_USER = process.env.DB_USER;
// // const DB_PASS = encodeURIComponent(process.env.DB_PASS);
// // const DB_URI = 'mongodb + srv://:<barbershop021>@api021.h2x5dw1.mongodb.net/test';

// Para arquivo .env: DB_USER:ZERO21 DB_PASS:barbershop021

// // mongoose.set('strictQuery', false);
// // mongoose.connect(process.env.URI)
// //     .then(result => {
// //         console.log("Conectado!");
// //         app.listen(process.env.PORT);
// //     })
// //     .catch(err => {
// //         console.error("Error: ", err.message);
// //     });
