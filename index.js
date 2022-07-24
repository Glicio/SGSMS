require("dotenv").config();
require("./database/database")
const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const app = express();
const path = require("path")

app.use(cors({ origin: "http://192.168.1.69:3000" }));

app.use(express.json());
app.use(require("./routes/userRoutes"));
app.use(require("./routes/paciEnteRoutes"));
app.use(require("./routes/medicamentoRoutes"));
app.use(require("./routes/saidaMedicamentosRoutes"));

app.use(express.static(path.join(__dirname, "./build/")));


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,"./build/index.html"))
});

app.listen(PORT, () => {
  console.log(`Servidor Rodando na porta: ${PORT}`);
});


/*
const glicio = { 
  const { createUser } = require("./database/userHandler");
  name: "Glicio Pereira Uchoa",
  cpf: "117.497.514-88",
  email: "glicioo@outlook.com",
  password: "Glicio123",
  isAdmin: true
}

createUser(glicio)*/
