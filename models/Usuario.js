const mongoose = require("mongoose");

const usuario = mongoose.model("Usuario", {
    nome: String,
    cpf: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    senha: String,
    telefone: String,
    data_nasc: String,
    tipo: {
        type: Number,
        default: 1 //roles: 0 = admin && 1 = cliente 
    },
    ative: {
        type: Boolean,
        default: true
    }
});

module.exports = usuario;