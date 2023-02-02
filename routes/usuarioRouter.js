const router = require('express').Router();
const auth = require('../services/auth');
const usuario = require('../models/Usuario');
const multer = require('multer');

router.post("/usuario/add", async function (req, res) {
    try {
        // Receber e montar o usuário
        const usuario = monteusuario(req);
        // Validar os dados;
        validusuario(usuario);
        // Verifica se usuário já existe
        await verifyusuarioExist(usuario.email);
        usuario.senha = await auth.createNewPass(usuario.senha);
        await usuario.create(usuario);
        res.status(200).json({ message: "Cadastrado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/usuario/list", async function (req, res) {
    try {
        let usuarios = await usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar!" });
    }
});

router.get("/usuario/:id", async function (req, res) {
    try {
        let idusuario = req.params.id;
        let usuario = await usuario.findOne({ _id: idusuario });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar!" });
    }
});

router.patch("/usuario/:id", async function (req, res) {
    try {
        // Receber e montar o usuário
        let idusuario = req.params.id;
        const usuario = monteusuario(req);
        // Validar os dados;
        validusuario(usuario, true);

        const updateusuario = await usuario.updateOne({ _id: idusuario }, usuario);

        if (updateusuario.matchedCount > 0) {
            res.status(200).json({ message: "Atualizado!" });
            return;
        } else {
            throw new Error("Erro ao atualizar!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/usuario/:id", async function (req, res) {
    try {
        let idusuario = req.params.id;
        let usuario = await usuario.findOne({ _id: idusuario });

        if (!usuario) {
            throw new Error("Erro ao remover o usuario!");
        }

        let deletusuario = await usuario.deleteOne({ _id: idusuario });
        if (deletusuario.deletedCount > 0) {
            res.status(200).json({ message: "Removido!" });
            return;
        } else {
            throw new Error("Erro ao remover o usuario!");
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/usuario/login", async function (req, res, next) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }

        const usuario = await usuario.findOne({ email: email, ative: true });
        if (!usuario) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }
        await auth.comparesenhas(senha, usuario.senha);
        const token = auth.createToken(usuario);
        return res.status(200).json({ message: "Usuário logado!", token: token });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Erro ao entrar!" });
    }
});


let upload = multer({ dest: './uploads/usuarios' });
router.post('/usuario/upload', upload.array('file'), async function (req, res) {
    try {
        //const usuarioAuth = await auth.checkToken(req, res);
        const usuarioID = req.body.usuario;
        const filename = req.files[0].filename.toString();
        const usuarioUpdate = await usuario.updateOne({ _id: usuarioID }, { foto: filename });
        if (filename && usuarioUpdate.matchedCount > 0) {
            let dataSend = { upload: true, files: req.files };
            return res.status(200).json(dataSend);
        }
        return res.status(500).json({ error: "Erro ao enviar os arquivos!" });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar os arquivos!" });
    }
});

// Função de registro de usuários 
function monteusuario(req) {
    const {
        nome,
        cpf,
        email,
        senha,
        telefone,
        data_nasc,
        ativo,
        tipo
    } = req.body;

    const usuario = {
        nome,
        cpf,
        email,
        senha,
        telefone,
        data_nasc,
        ativo,
        tipo
    };

    return usuario;
}

function validusuario(usuario) {
    let error = 0;

    if (!usuario.email) {
        error++;
        res.status(422).json({ message: "E-mail obrigatório!" });
        return
    }

    if (!usuario.nome) {
        error++;
        res.status(422).json({ message: "Nome obrigatório!" });
        return;
    }

    if (!usuario.senha) {
        error++;
        res.status(422).json({ message: "Senha obrigatório!" });
        return;
    }

    if (error > 0) {
        throw new Error('Erro ao cadastrar ou usuário já cadastrado!');
    }
}

async function verifyusuarioExist(email) {
    let usuario = await usuario.exists({ email: email });
    if (usuario) {
        throw new Error('Erro ao cadastrar ou usuário já cadastrado!');
    }
}

module.exports = router;