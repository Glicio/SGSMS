const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  cartao_sus: {
    type: String,
    unique: true,
    required: true,
  },
  agente_c_saude: {
    type: String,
    required: false,
  },
  telefone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  endereco: {
    type: String,
    required: true,
  },
});

module.exports = PacienteSchema;
