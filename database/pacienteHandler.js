const mongoose = require("mongoose");
const PacienteSchema = require("./schemas/Paciente");
const Paciente = mongoose.model("Paciente", PacienteSchema);

const createPaciente = (pacienteToCreate) => {
  const paciente = new Paciente({
    name: pacienteToCreate.name,
    cpf: pacienteToCreate.cpf,
    cartao_sus: pacienteToCreate.cartao_sus,
    agente_c_saude: pacienteToCreate.agente_c_saude,
    telefone: pacienteToCreate.telefone,
    email: pacienteToCreate.email,
    endereco: pacienteToCreate.endereco,
  });

  return paciente.save();
};

async function getPacientesPaginated(search, page, limit) {
  page = page ? page : 1;
  limit = limit ? limit : 10;
  search = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { cpf: new RegExp(search, "i") },
          { endereco: new RegExp(search, "i") },
          { cartao_sus: new RegExp(search, "i") },
          { agente_c_saude: new RegExp(search, "i") },
        ],
      }
    : {};
  try {
    const count = await Paciente.countDocuments(search);
    const pacientes = await Paciente.find(search)
      .limit(limit)
      .skip((page - 1) * limit);
    return {
      pacientes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (err) {
    console.error(err.message);
  }
}

async function updatePaciente(pacienteToUpdate) {
  const pacienteOld = await Paciente.findOne({ _id: pacienteToUpdate._id });
  let updates = {
    name: pacienteToUpdate.name,
    agente_c_saude: pacienteToUpdate.agente_c_saude,
    telefone: pacienteToUpdate.telefone,
    email: pacienteToUpdate.email,
    endereco: pacienteToUpdate.endereco,
  };

  //cpf: pacienteToUpdate.cpf,
  //cartao_sus: pacienteToUpdate.cartao_sus,
  if (pacienteToUpdate.cpf !== pacienteOld.cpf) {
    updates = { ...updates, cpf: pacienteToUpdate.cpf };
  }
  if (pacienteToUpdate.cartao_sus !== pacienteOld.cartao_sus) {
    updates = { ...updates, cartao_sus: pacienteToUpdate.cartao_sus };
  }
  return Paciente.updateOne({ _id: pacienteToUpdate._id }, updates);
}

module.exports.updatePaciente = updatePaciente;
module.exports.createPaciente = createPaciente;
module.exports.getPacientesPaginated = getPacientesPaginated;
