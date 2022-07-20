const express = require("express");
const { validateUserToken } = require("../middleware/userMiddlewares");
const router = express.Router();
const {
  createPaciente,
  getPacientesPaginated,
  updatePaciente,
} = require("../database/pacienteHandler");

router.post("/paciente/create", validateUserToken, (req, res) => {
  const paciente = req.body.pacienteToCreate;
  if (!paciente || paciente === null)
    return res.status(401).send({
      status: "Error",
      message: "Erro ao criar paciente: informações não fornecidas!",
    });
  createPaciente(paciente)
    .then((succ) => {
      return res.status(200).send({
        status: "success",
        message: `Paciente ${paciente.name} criado com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "error",
        message: `Erro ao criar usuário`,
        error: err,
      });
    });
});

router.post("/paciente/get", validateUserToken, (req, res) => {
  const search = req.body.search;
  const page = req.body.page;
  const limit = req.body.limit;
  getPacientesPaginated(search, page, limit)
    .then((succ) => {
      return res.status(200).send(succ);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.post("/paciente/update", validateUserToken, (req, res) => {
  const pacienteToUpdate = req.body.pacienteToUpdate;
  updatePaciente(pacienteToUpdate)
    .then((succ) => {
      res.status(200).send({
        status: "Success",
        menssage: "Paciente modificado com sucesso",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        status: "Error",
        menssage: "Erro ao Atualizar paciente!",
        error: err,
      });
    });
});

module.exports = router;
