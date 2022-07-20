const mongoose = require("mongoose");
const MedicamentoSchema = require("./schemas/Medicamentos");
const Medicamento = mongoose.model("Medicamento", MedicamentoSchema);

const createMedicamento = (medicamentoToCreate) => {
  const { descricao, unidade } = medicamentoToCreate;

  const medicamento = new Medicamento({
    descricao: descricao,
    unidade: unidade,
  });

  return medicamento.save();
};

const updateMedicamento = (medicamentoToUpdate) => {
  return Medicamento.updateOne(
    { _id: medicamentoToUpdate._id },
    {
      descricao: medicamentoToUpdate.descricao,
      unidade: medicamentoToUpdate.unidade,
    }
  );
};

async function getMedicamentosPaginated(search, page, limit) {
  page = page ? page : 1;
  limit = limit ? limit : 10;
  search = search
    ? {
        $or: [
          { descricao: new RegExp(search, "i") },
          { unidade: new RegExp(search, "i") },
        ],
      }
    : {};
  try {
    const count = await Medicamento.countDocuments(search);
    const medicamentos = await Medicamento.find(search)
      .limit(limit)
      .skip((page - 1) * limit);
    return {
      medicamentos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (err) {
    return { error: err };
  }
}

module.exports.createMedicamento = createMedicamento;
module.exports.updateMedicamento = updateMedicamento;
module.exports.getMedicamentosPaginated = getMedicamentosPaginated;
