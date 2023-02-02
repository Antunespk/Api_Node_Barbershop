const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const auth = {
    createNewPass: async function (senha) {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(senha, salt);
    },
    comparesenhas: async function (senhaUsuario, senhaDB) {
        const checkPass = await bcrypt.compare(senhaUsuario, senhaDB);
        if (!checkPass) {
            throw new Error("Senha invalida!");
        }
    },
    createToken: function (usuario) {
        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({
                id: usuario._id,
                nome: usuario.nome,
                tipo: usuario.tipo
            }, secret);
            return token;
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Erro ao montar o token!");
        }
    },
    checkToken: function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;;
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: "Usuário sem acesso!" });
            }
            const secret = process.env.SECRET;
            jwt.verify(token, secret, (err, usuarioInfo) => {
                if (err) {
                    return res.status(401).json({ error: "Usuário sem acesso!" });
                }
                console.log(usuarioInfo);
                return usuarioInfo;
            });
            next();
        } catch (error) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }
    },

};

module.exports = auth; 