const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/saude")
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((err) => console.log(`Erro ao conectar ao Banco de dados: ${err}`));

// middlewares
