// Inicio do codigo
const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const auth = require('./services/auth');

const app = express();

// app.listen(5050);
app.use(cors());

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

const usuarioRouter = require("./routes/usuarioRouter");

app.use(usuarioRouter);

//Banco de Dados
const DB_usuario = process.env.DB_USUARIO;
const DB_senha = encodeURIComponent(process.env.DB_SENHA);
// const DB_URI = `mongodb+srv://:${DB_usuario}:${DB_PASS}@api021.h2x5dw1.mongodb.net/test`;
//console.log(DB_senha);
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${DB_usuario}:${DB_senha}@api021.h2x5dw1.mongodb.net/test`)
    .then(result => {
        console.log("Conectado!");
        app.listen(process.env.PORT || 5050);
    })
    .catch(err => {
        console.error("Error: ", err.message);
    });
