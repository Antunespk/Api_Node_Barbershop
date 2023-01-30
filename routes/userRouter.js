const router = require('express').Router();
const auth = require('../services/auth');
const User = require('../models/User');
const multer = require('multer');

router.post("/usuario/add", async function (req, res) {
    try {
        // Receber e montar o usuário
        const user = monteUser(req);
        // Validar os dados;
        validUser(user);
        // Verifica se usuário já existe
        await verifyUserExist(user.email);
        user.senha = await auth.createNewPass(user.senha);
        await User.create(user);
        res.status(200).json({ message: "Cadastrado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/usuario/list", async function (req, res) {
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.get("/usuario/:id", async function (req, res) {
    try {
        let iduser = req.params.id;
        let user = await User.findOne({ _id: iduser });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar!" });
    }
});

router.patch("/usuario/:id", async function (req, res) {
    try {
        // Receber e montar o usuário
        let iduser = req.params.id;
        const user = monteUser(req);
        // Validar os dados;
        validUser(user, true);

        const updateUser = await User.updateOne({ _id: iduser }, user);

        if (updateUser.matchedCount > 0) {
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
        let iduser = req.params.id;
        let user = await User.findOne({ _id: iduser });

        if (!user) {
            throw new Error("Erro ao remover o usuario!");
        }

        let deletUser = await User.deleteOne({ _id: iduser });
        if (deletUser.deletedCount > 0) {
            res.status(200).json({ message: "Removido!" });
            return;
        } else {
            throw new Error("Erro ao remover o usuario!");
        }
        res.status(200).json(user);
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

        const user = await User.findOne({ email: email, ative: true });
        if (!user) {
            return res.status(401).json({ error: "Usuário sem acesso!" });
        }
        await auth.comparePasswords(senha, user.senha);
        const token = auth.createToken(user);
        return res.status(200).json({ message: "Usuário logado!", token: token });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Error ao entrar!" });
    }
});


let upload = multer({ dest: './uploads/users' });
router.post('/usuario/upload', upload.array('file'), async function (req, res) {
    try {
        //const userAuth = await auth.checkToken(req, res);
        const userID = req.body.user;
        const filename = req.files[0].filename.toString();
        const userUpdate = await User.updateOne({ _id: userID }, { foto: filename });
        if (filename && userUpdate.matchedCount > 0) {
            let dataSend = { upload: true, files: req.files };
            return res.status(200).json(dataSend);
        }
        return res.status(500).json({ error: "Erro ao enviar os arquivos!" });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar os arquivos!" });
    }
});

// Função de registro de usuários 
function monteUser(req) {
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

    const user = {
        nome,
        cpf,
        email,
        senha,
        telefone,
        data_nasc,
        ativo,
        tipo
    };

    return user;
}

function validUser(user) {
    let error = 0;

    if (!user.email) {
        error++;
        res.status(422).json({ message: "E-mail obrigatório!" });
        return
    }

    if (!user.nome) {
        error++;
        res.status(422).json({ message: "Nome obrigatório!" });
        return;
    }

    if (!user.senha) {
        error++;
        res.status(422).json({ message: "Senha obrigatório!" });
        return;
    }

    if (error > 0) {
        throw new Error('Error ao cadastrar ou usuário já cadastrado!');
    }
}

async function verifyUserExist(email) {
    let user = await User.exists({ email: email });
    if (user) {
        throw new Error('Erro ao cadastrar ou usuário já cadastrado!');
    }
}

module.exports = router;