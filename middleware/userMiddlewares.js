const { getUserByCPF, getUserById } = require("../database/userHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

//middleware autentica o usuário com base no cpf e senha
//retorna uma objeto contento as informações do usuário
async function authenticateUser(req, res, next) {
  const password = req.body.password;
  const cpf = req.body.cpf;
  if (!(cpf && password)) {
    res.status(400);
    req.user = {
      status: "Error",
      menssage: "Dados inválidos!",
    };
    next();
    return;
  }
  const userToAuthenticate = await getUserByCPF(cpf);

  if (!userToAuthenticate) {
    req.user = {
      status: "Error",
      menssage: "Usuário não encontrado!",
    };
    res.status(401);
    next();
    return;
  }

  const paswordMatch = bcrypt.compareSync(
    password,
    userToAuthenticate.password_hash
  );

  if (!paswordMatch) {
    req.user = {
      status: "Error",
      menssage: "Senha Incorreta!",
    };
    res.status(403);
    next();
    return;
  }

  req.user = {
    id: userToAuthenticate._id,
    name: userToAuthenticate.name,
    cpf: userToAuthenticate.cpf,
    email: userToAuthenticate.email,
    canUseFarmacia: userToAuthenticate.canUseFarmacia,
    canUseMarcacao: userToAuthenticate.canUseMarcacao,
    isAdmin: userToAuthenticate.isAdmin,
  };

  next();
}

//checa se o usuário é um administrador, manda uma resposta de erro casa não seja
async function userIsAdmin(req, res, next) {
  //precisa ser chamado após validateToken
  if (req.user === null || !req.user)
    return res
      .status(400)
      .send({ status: "error", message: "Usuário inválido!" });
  let userToCheck = await getUserById(req.user.id);
  if (!userToCheck?.isAdmin)
    return res.status(401).send({
      status: "error",
      message: "Usuário não é tem autorização para realizar esta Operação!",
    });

  return next();
}

//checa se usuário pode usar a farmácia.
async function canUseFarmacia(req, res, next) {
  //precisa ser chamado após validateToken
  if (req.user === null || !req.user)
    return res
      .status(400)
      .send({ status: "error", message: "Usuário inválido!" });
  let userToCheck = await getUserById(req.user.id);
  if (!userToCheck?.canUseFarmacia)
    return res.status(401).send({
      status: "error",
      message: "Usuário não é tem autorização para realizar esta Operação!",
    });

  return next();
}

//checa se usuário pode usar a marcacao.
async function canUseMarcacao(req, res, next) {
  //precisa ser chamado após validateToken
  if (req.user === null || !req.user)
    return res
      .status(400)
      .send({ status: "error", message: "Usuário inválido!" });
  let userToCheck = await getUserById(req.user.id);
  if (!userToCheck?.canUseMarcacao)
    return res.status(401).send({
      status: "error",
      message: "Usuário não é tem autorização para realizar esta Operação!",
    });

  return next();
}

//valida o token atual do usuário e define o req.user
async function validateUserToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token || token == null)
    return res.status(400).send({
      status: "Error",
      menssage: "Não foi enviado o token de autenticação",
    });

  try {
    const user = jwt.verify(token, TOKEN_SECRET);
    req.user = user;
  } catch (err) {
    return res.status(401).send({
      status: "Error",
      menssage: `Tonken inválido ou não existente: ${err}`,
    });
  }

  next();
}

//Atualiza as informações do usuário a partir do banco de dados
async function updateUser(req, res, next) {
  //precisa ser chamado após validateToken
  if (req.user === null)
    return res
      .status(400)
      .send({ status: "error", message: "Usuário inválido!" });
  let userToUpdate = await getUserById(req.user.id);
  if (!userToUpdate)
    return res.status(401).send({
      status: "error",
      message: "Usuário não encontrado!",
    });
  req.user == userToUpdate;

  return next();
}

module.exports.authenticateUser = authenticateUser;
module.exports.userIsAdmin = userIsAdmin;
module.exports.canUseFarmacia = canUseFarmacia;
module.exports.canUseMarcacao = canUseMarcacao;
module.exports.validateUserToken = validateUserToken;
module.exports.updateUser = updateUser;
