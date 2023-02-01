// Inicio do codigo
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const auth = require('./services/auth');

const app = express();

// app.listen(5050);
// app.use(cors());

//Configurando Express
app.use(express.urlencoded({ extended: true }));
//Configuração do JSON
app.use(express.json());

//Rotas
app.get("/", function (req, res) {
    console.log("Request:", req);
    res.status(200).json({ message: "Bem vindo!" });
});
//bloqueio de rota, caso o usuario precise estar logado para acessar tal rota:
// app.get("/", auth.checkToken, function (req, res) {
// console.log("Request:", req);
// res.status(200).json({ message: "Bem vindo!" });
// });

const userRouter = require("./routes/userRouter");

app.use(userRouter);

//Banco de Dados
const DB_USER = process.env.DB_USER;
const DB_PASS = encodeURIComponent(process.env.DB_PASS);
const DB_URI = `mongodb + srv://:${DB_USER}:${DB_PASS}@api021.h2x5dw1.mongodb.net/test`;

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@api021.h2x5dw1.mongodb.net/test`)
    .then(result => {
        console.log("Conectado!");
        app.listen(5050);
    })
    .catch(err => {
        console.error("Error: ", err.message);
    });
