const express = require("express");
const {
  createMedicamento,
  updateMedicamento,
  getMedicamentosPaginated,
} = require("../database/medicamentosHandler");
const {
  validateUserToken,
  canUseFarmacia,
} = require("../middleware/userMiddlewares");
const router = express.Router();

router.post(
  "/medicamentos/create",
  validateUserToken,
  canUseFarmacia,
  (req, res) => {
    const medicamentoToCreate = req.body.medicamentoToCreate;
    createMedicamento(medicamentoToCreate)
      .then(() => {
        return res.status(200).send({
          status: "Success",
          message: "Medicamento incluído com sucesso!",
        });
      })
      .catch((err) => {
        return res.status(400).send({
          status: "Error",
          message: "Error ao incluir medicamento!",
          error: err,
        });
      });
  }
);

router.post(
  "/medicamentos/update",
  validateUserToken,
  canUseFarmacia,
  (req, res) => {
    const medicamentoToUpdate = req.body.medicamentoToUpdate;
    updateMedicamento(medicamentoToUpdate)
      .then(() => {
        return res.status(200).send({
          status: "Success",
          message: "Medicamento editado com sucesso!",
        });
      })
      .catch((err) => {
        return res.status(400).send({
          status: "Error",
          message: "Erro ao editar medicamento",
          error: err,
        });
      });
  }
);

router.post(
  "/medicamentos/get",
  validateUserToken,
  canUseFarmacia,
  (req, res) => {
    const search = req.body.search;
    const page = req.body.page;
    const limit = req.body.limit;
    getMedicamentosPaginated(search, page, limit)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
);

module.exports = router;
