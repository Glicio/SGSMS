const mongoose = require("mongoose");

const MedicamentoSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
    unique: true,
  },
  unidade: {
    type: String,
  },
});

module.exports = MedicamentoSchema;
