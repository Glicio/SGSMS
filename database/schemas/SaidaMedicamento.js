const mongoose = require("mongoose");
const PacienteSchema = require("./Paciente");

const SaidaMedicamentoSchema = new mongoose.Schema({
  medicamentos: {
    type: Array,
    default: undefined,
  },
  paciente: {
    name: String,
    id: String,
    cpf: String,
    cartao_sus: String,
  },
  data: { type: Date, default: Date.now() },
  user: {
    name: String,
    id: String,
  },
});
module.exports = SaidaMedicamentoSchema;
