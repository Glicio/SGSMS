import React from "react";
import FormItem from "../../FormItem";
import api from "../../../services/api";
import { ReactComponent as Fechar } from "../../static/close.svg";
import { useContext } from "react";
import { SaudeContext } from "../../../Saude";

export default function MedicamentoForm({
  medicamento,
  setMedicamento,
  toggleSelf,
}) {
  const saudeContext = useContext(SaudeContext);
  const criarMedicamento = (medicamentoToCreate) => {
    api
      .post(
        "/medicamentos/create",
        { medicamentoToCreate: medicamentoToCreate },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        saudeContext.notify.success("Medicamento incluído com sucesso!", {
          position: "bottom-right",
        });
        setMedicamento({ descricao: "", unidade: "" });
        toggleSelf();
      })
      .catch((err) => {
        saudeContext.notify.error(
          "Erro ao incluir Medicamento!" + err.message,
          { position: "bottom-right" }
        );
        console.error(err);
      });
  };
  const editarMedicamento = (medicamentoToUpdate) => {
    api
      .post(
        "/medicamentos/update",
        { medicamentoToUpdate: medicamentoToUpdate },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        saudeContext.notify.success("Medicamento editado com sucesso!", {
          position: "bottom-right",
        });
        setMedicamento({ descricao: "", unidade: "" });
        toggleSelf();
      })
      .catch((err) => {
        saudeContext.notify.error("Erro ao editar Medicamento!" + err.message, {
          position: "bottom-right",
        });
        console.error(err);
      });
  };

  const setDescricao = (value) => {
    setMedicamento((old) => {
      return { ...old, descricao: value };
    });
  };
  const setUnidade = (value) => {
    setMedicamento((old) => {
      return { ...old, unidade: value };
    });
  };
  return (
    <div
      className="modal-container"
      onMouseDown={(e) => {
        if (e.target.className === "modal-container") toggleSelf();
      }}
    >
      <form
        action=""
        className="paciente-form pop-up-anim"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <button
          className="user-options-btn"
          type="button"
          style={{ alignSelf: "end" }}
          onClick={() => {
            toggleSelf();
          }}
        >
          <Fechar width="0.50rem" />
        </button>
        <h1 className="titulo" style={{ marginTop: "1.5rem" }}>
          {medicamento._id ? "Editar Medicamento" : "Incluir Medicamento"}
        </h1>
        <div className="separador-menu"></div>
        <FormItem
          type={"text"}
          value={medicamento.descricao}
          setValue={setDescricao}
          label={"Descrição"}
        />
        <FormItem
          type={"text"}
          value={medicamento.unidade}
          setValue={setUnidade}
          label={"Unidade"}
        />
        <button
          className="login-btn"
          onClick={() => {
            if (medicamento._id) {
              return editarMedicamento(medicamento);
            }
            criarMedicamento(medicamento);
          }}
          style={{ marginLeft: "auto", marginRight: "1rem" }}
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
