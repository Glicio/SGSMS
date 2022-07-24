const mongoose = require("mongoose");
const SaidaMedicamentoSchema = require("./schemas/SaidaMedicamento.js");
const Saida = mongoose.model("saidasMedicamentos", SaidaMedicamentoSchema);

async function insertSaida(saida) {
  const { medicamentos, paciente, data, user } = saida;

  const saidaToInsert = new Saida({
    medicamentos: medicamentos,
    paciente: paciente,
    data: data,
    user: user,
  });

  return saidaToInsert.save();
}

async function getSaidasPaginated(search, page, limit) {
  page = page ? page : 1;
  limit = limit ? limit : 10;
  search = search
    ? {
        $or: [
          { "paciente.name": new RegExp(search, "i") },
          { "paciente.cpf": new RegExp(search, "i") },
          { "paciente.cartao_sus": new RegExp(search, "i") },
          { "medicamentos.descricao": new RegExp(search, "i") },
        ],
      }
    : {};
  try {
    const count = await Saida.countDocuments(search);
    const saidas = await Saida.find(search)
      .limit(limit)
      .skip((page - 1) * limit).sort({data: -1})
    return {
      saidas: saidas,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (err) {
    console.error(err.message);
  }
}

async function editSaida(saidaToUpdate) {
  const {paciente, medicamentos} = saidaToUpdate;
  return Saida.updateOne({_id: saidaToUpdate._id},{paciente: paciente, medicamentos: medicamentos})
}

async function getSaidaByPacienteId(pacienteId){
  const saida = await Saida.findOne({"paciente._id": pacienteId},{},{sort:{data: -1 }})
  return saida
}

async function deleteSaida(id) {
  return Saida.deleteOne({ _id: id });
}

module.exports.editSaida = editSaida;
module.exports.deleteSaida = deleteSaida;
module.exports.insertSaida = insertSaida;
module.exports.getSaidasPaginated = getSaidasPaginated;
module.exports.getSaidaByPacienteId = getSaidaByPacienteId
