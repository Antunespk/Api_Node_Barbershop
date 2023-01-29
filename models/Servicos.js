const mongoose = require("mongoose");
const Servicos = mongoose.model("Servicos", {
    nome: String,
    valor: String,
    tipo: {
        type: Number
    }
});
module.exports = Servicos;