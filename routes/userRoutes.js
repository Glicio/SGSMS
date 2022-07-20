const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const {
  getUsersPaginated,
  createUser,
  validateRefreshToken,
  deleteRefreshToken,
  createRefreshToken,
  updateUser,
} = require("../database/userHandler");
const {
  authenticateUser,
  userIsAdmin,
  validateUserToken,
} = require("../middleware/userMiddlewares");

router.get("/teste", (req, res) => {
  res.send("TESTE");
});
//Criar novo usuário
router.post(
  "/auth/user/create",
  validateUserToken,
  userIsAdmin,
  async (req, res) => {
    if (!req.body.userToCreate.cpf || req.body.userToCreate.cpf.includes("_"))
      return res.status(401).send({ status: "error", message: "cpf inválido" });
    createUser(req.body.userToCreate)
      .then(() =>
        res.status(201).send({
          status: "Success",
          message: `Usuário ${req.body.userToCreate.name} criado com sucesso!`,
        })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          status: "Error",
          message: `${
            err.keyPattern
              ? "Já existe um usuário com esse " +
                Object.getOwnPropertyNames(err.keyPattern)
              : "Erro ao criar usuário: " + err
          }`,
        });
      });
  }
);

//Logar usuário
router.post("/auth/user/login", authenticateUser, (req, res) => {
  //Autentica o usuário e lhe dá um token JWT com validade de 24hrs e um Refresh Token válido por 30 dias.
  if (req.user.status === "Error") return res.send(req.user);

  let token = jwt.sign(req.user, TOKEN_SECRET, { expiresIn: "24h" });
  let refreshToken = jwt.sign({ user: req.user }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  createRefreshToken(req.user.id, refreshToken);

  res.send({
    user: req.user,
    status: "Success",
    token: token,
    refreshToken: refreshToken,
  });
});

//pega e pagina todos os usuários
router.get("/auth/user/validate", validateUserToken, (req, res) => {
  res.status(200).send(req.user);
});

//não utilizado no momento
//Atualizar token usando refresh token
router.post("/auth/token/refresh", (req, res) => {
  //Gera uma novo token JWT com base no Refresh Token que deve ser passado no header http "authorization" no modelo Bearer token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  validateRefreshToken(token).then((valid) => {
    if (!valid) {
      return res.send({
        status: "Error",
        menssage: "Refresh Token Inválido ou expirado!",
      });
    }
    const data = jwt.verify(token, REFRESH_TOKEN_SECRET).user;
    return res.send({ token: jwt.sign(data, TOKEN_SECRET) });
  });
});

//deleta refresh token.
router.delete("/auth/token/delete", (req, res) => {
  //Delete um refresh token passado no header "authorization"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  deleteRefreshToken(token).then((deleted) => {
    if (!deleted) {
      return res.send({ status: "Error", menssage: "Erro ao deletar token!" });
    }
    return res.send({ status: "success", menssage: "Refresh Token Deletado!" });
  });
});

//get users pagineted
router.all("/users/get", validateUserToken, userIsAdmin, async (req, res) => {
  let page = req.body.page ? req.body.page : 1;
  let limit = req.body.limit ? req.body.limit : 10;

  let search = req.body.search ? req.body.search : undefined;
  const users = await getUsersPaginated(search, page, limit);
  if (users) return res.status(200).send(users);

  return res
    .status(500)
    .send({ status: "error", message: "Erro ao obter usuários!" });
});

router.post("/user/update", validateUserToken, userIsAdmin, (req, res) => {
  const updatedUser = req.body.updatedUser;

  updateUser(updatedUser)
    .then((succ) => {
      return res.status(200).send(succ);
    })
    .catch((err) => {
      return res.status(503).send(err.message);
    });
});

console.log("Rotas de usuário carregadas.");
module.exports = router;
