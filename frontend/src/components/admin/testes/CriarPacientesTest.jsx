import api from "../../../services/api";
import { SaudeContext } from "../../../Saude";
import React, { useContext, useState } from "react";
import {
  generateCartaoSus,
  generateCpf,
  generateEmail,
  generateEndereco,
  generateName,
} from "./generator";

const generatePacientes = (quantidade) => {
  let pacientes = [];
  for (let i = 0; i < quantidade; i++) {
    let paciente = {
      name: generateName(),
      cpf: generateCpf(),
      cartao_sus: generateCartaoSus(),
      agente_c_saude: generateName(),
      telefone: "(82) 9 9999-9999",
      email: generateEmail(),
      endereco: generateEndereco(),
    };
    pacientes.push(paciente);
  }
  return pacientes;
};

export default function CriarPacientesTest() {
  const [nPacientes, setNPacientes] = useState(0);
  const saudeContext = useContext(SaudeContext);

  const createPaciente = (paciente) => {
    api
      .post(
        "/paciente/create",
        { pacienteToCreate: paciente },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((succ) => {
        saudeContext.notify.success(
          `Paciente ${paciente.name} criado com sucesso!`,
          { position: "bottom-right" }
        );
      })
      .catch((err) => {
        saudeContext.notify.error(
          `Erro ao criar paciente: Já existe um paciente com esse ${
            Object.getOwnPropertyNames(err.response.data.error.keyValue)[0]
          }`,
          { position: "bottom-right" }
        );
      });
  };

  return (
    <form
      action=""
      className="usuario-form"
      style={{ width: "auto" }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="form-item" style={{ width: "auto" }}>
        <label htmlFor="paciente">Número de pacientes a serem criados</label>
        <input
          type="number"
          name="paciente"
          id="paciente"
          value={nPacientes}
          onChange={(e) => {
            setNPacientes(e.target.value);
          }}
        />
      </div>
      <button
        onClick={() => {
          const pacientes = generatePacientes(nPacientes);
          for (let paciente of pacientes) {
            createPaciente(paciente);
          }
        }}
      >
        Criar
      </button>
    </form>
  );
}
