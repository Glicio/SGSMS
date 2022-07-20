const express = require("express");
const {
  insertSaida,
  getSaidasPaginated,
  deleteSaida,
  editSaida,
} = require("../database/saidaMedicamentosHandler");
const router = express.Router();
const {
  validateUserToken,
  canUseFarmacia,
} = require("../middleware/userMiddlewares");

router.post("/saidas/create", validateUserToken, canUseFarmacia, (req, res) => {
  const saida = req.body.saida;
  insertSaida(saida)
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      return res.status(301).send(err);
    });
});

router.post("/saidas/get", validateUserToken, canUseFarmacia, (req, res) => {
  const search = req.body.search;
  const page = req.body.page;
  const limit = req.body.limit;
  getSaidasPaginated(search, page, limit)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

router.post(
  "/saidas/delete",
  validateUserToken,
  canUseFarmacia,
  (req, res) => {
    const id = req.body.id
    deleteSaida(id).then((result) => {
      return res.status(200).send(result)
    }).catch((err) => {
      return res.status(300).send(err)
    });
  }
);

router.post("/saidas/update", validateUserToken, canUseFarmacia, (req,res) => {
  const saida = req.body.saida
  editSaida(saida).then((result) => {
    return res.status(204).send(result)
  }).catch((err) => {
    console.log(err);
    return res.status(300).send(err)

  });
})

module.exports = router;
