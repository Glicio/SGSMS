import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import SelectMedicamento from "../form/SelectMedicamento";
import SelectPaciente from "../form/SelectPaciente";
import api from "../../services/api";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function SaidaForm({ sendPaciente }) {
  const [paciente, setPaciente] = useState();
  const [medicamentos, setMedicamentos] = useState();

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (paciente) sendPaciente(paciente);
  }, [medicamentos, paciente]);

  const salvar = (saida) => {
    console.log(saida);
    api
      .post(
        "/saidas/create",
        { saida: saida },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form
      style={{ width: "fit-content" }}
      className="paciente-form"
      action=""
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <h1 className="titulo">Incluir nova saída de medicamentos</h1>
      <div className="separador-menu"></div>
      <SelectPaciente setPaciente={setPaciente} paciente={paciente} />
      <SelectMedicamento
        medicamentos={medicamentos}
        setMedicamentos={setMedicamentos}
      />
      <button
        className="login-btn"
        onClick={() => {
          console.log(userContext.currentUser);
          salvar({
            medicamentos,
            paciente: {
              name: paciente.name,
              id: paciente._id,
              cpf: paciente.cpf,
              cartao_sus: paciente.cartao_sus,
            },
            data: Date.now(),
            user: {
              name: userContext.currentUser.name,
              id: userContext.currentUser.id,
            },
          });
        }}
      >
        Salvar
      </button>
    </form>
  );
}
