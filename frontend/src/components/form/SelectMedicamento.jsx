import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import { SaudeContext } from "../../Saude";
import { ReactComponent as Confirmed } from "../static/confirm.svg";
import { ReactComponent as Editar } from "../static/pencil.svg";
import { ReactComponent as Deletar } from "../static/delete.svg";
import "./SelectMedicamento.css";

const SEARCH_TIME = 300;

const getMedicamentosPaginated = (search, page, limit) => {
  const token = localStorage.getItem("token");
  return api.post(
    "/medicamentos/get",
    { search: search, page: page, limit: limit },
    {
      headers: { authorization: "Bearer " + token },
    }
  );
};

export default function SelectMedicamento({ setMedicamentos }) {
  const [term, setTerm] = useState("");
  const [termToSearch, setTermToSearch] = useState();
  const [medicamentoList, setMedicamentoList] = useState();
  const [selected, setSelected] = useState();
  const [quantidade, setQuantidade] = useState(0);
  const [selectedMedicamentos, setSelectedMedicamentos] = useState();
  const [medicamentosSelectedButtons, setMedicamentosSelectedButtons] =
    useState();
  const saudeContext = useContext(SaudeContext);

  const addMedicamentoToSelected = (medicamento) => {
    setSelectedMedicamentos((old) => {
      return { ...old, [medicamento.descricao]: medicamento };
    });
  };
  const removeMedicamentotoSelected = (key) => {
    setSelectedMedicamentos((old) => {
      let res = { ...old };
      delete res[key];
      return res;
    });
  };

  const getMedicamentosSelectedButtons = () => {
    if (!selectedMedicamentos) return [];
    const res = Object.getOwnPropertyNames(selectedMedicamentos).map((curr) => {
      return (
        <div key={selectedMedicamentos[curr]._id} className="medicamento">
          <div style={{ maxWidth: "70%" }}>
            {selectedMedicamentos[curr].quantidade}{" "}
            {selectedMedicamentos[curr].unidade}
            {"(s) de "}
            {selectedMedicamentos[curr].descricao}
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto",
            }}
            onClick={() => {
              removeMedicamentotoSelected(curr);
            }}
          >
            <Deletar
              width={"0.8rem"}
              fill="white"
              style={{ marginLeft: "0.2rem", marginTop: "0.1rem" }}
            />
          </button>
        </div>
      );
    });
    return res;
  };

  const getMedicamentosButtons = () => {
    if (!medicamentoList) return;
    if (medicamentoList.length === 0) {
      return [
        <button
          key={"naoencontrado"}
          className="selectButton"
          onClick={(e) => {
            setMedicamentoList();
          }}
        >
          Não encontrado!
        </button>,
      ];
    }
    let res = [];

    for (let medicamento of medicamentoList) {
      res = [
        ...res,
        <button
          key={medicamento.descricao}
          className="selectButton"
          onClick={(e) => {
            setMedicamentoList();
            setSelected(medicamento);
          }}
        >
          {medicamento.descricao}
        </button>,
      ];
    }

    return res;
  };

  useEffect(() => {
    setMedicamentoList(undefined);
    setSelected(undefined);
    const termTimeOut = setTimeout(() => {
      setTermToSearch(term);
    }, SEARCH_TIME);
    return () => clearTimeout(termTimeOut);
  }, [term]);

  useEffect(() => {
    if (!termToSearch) {
      setTerm("");
      setMedicamentoList(undefined);
      return;
    }
    getMedicamentosPaginated(term, 1, 5)
      .then((result) => {
        setMedicamentoList(result.data.medicamentos);
      })
      .catch((err) => {
        saudeContext.notify.error(
          "Não foi possível obter a lista de pacientes!",
          { position: "bottom-right" }
        );
      });
    // eslint-disable-next-line
  }, [termToSearch]);

  useEffect(() => {
    if (!selectedMedicamentos) return;
    setMedicamentosSelectedButtons(getMedicamentosSelectedButtons());
    setMedicamentos((old) => {
      let res = [];
      for (let medicamento of Object.getOwnPropertyNames(
        selectedMedicamentos
      )) {
        res.push(selectedMedicamentos[medicamento]);
      }
      return res;
    });
    // eslint-disable-next-line
  }, [selectedMedicamentos]);
  return (
    <div
      className="form-item"
      onBlur={(e) => {
        setTimeout(() => {
          setMedicamentoList(undefined);
        }, 300);
      }}
    >
      <div
        className="form-item"
        style={{
          position: "",
          overflow: "unset",
        }}
      >
        <label htmlFor="medicamento">Adicionar Medicamentos</label>
        <div
          className="medicamentoInputContainer"
          style={{ overflow: "visible", marginLeft: "0.5rem" }}
        >
          <div
            className="medicamentoInputDesc"
            style={{
              display: "flex",
              minWidth: "fit-content",
              position: "relative",
              overflow: "visible",
            }}
          >
            <div className="form-item" style={{ minWidth: "fit-content" }}>
              <label htmlFor="descricao">Descrição</label>
              <div
                className="inputandsymbols"
                style={{ display: "flex", width: "12rem" }}
              >
                <div
                  className="results-list"
                  style={{
                    overflow: "auto",
                    minHeight: "fit-content",
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    left: "0",
                    top: "2.5rem",
                  }}
                >
                  {medicamentoList && getMedicamentosButtons()}
                </div>
                {selected ? (
                  <input
                    className="medicamentoInput"
                    type={"text"}
                    disabled
                    value={selected.descricao}
                    readOnly
                  />
                ) : (
                  <input
                    type="text"
                    className="medicamentoInput"
                    value={term}
                    onChange={(e) => {
                      setTerm(e.target.value);
                    }}
                  />
                )}
                {selected && (
                  <>
                    <Confirmed
                      width={"1rem"}
                      style={{ alignSelf: "bottom", marginInline: "0.2rem" }}
                    />
                    <button
                      style={{
                        background: "none",
                        cursor: "pointer",
                        border: "none",
                      }}
                      onClick={() => {
                        setSelected(undefined);
                      }}
                    >
                      <Editar
                        width={"1rem"}
                        height={"1rem"}
                        fill={"yellow"}
                        style={{ marginInline: "0.2rem" }}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="form-item" style={{ width: "unset" }}>
            <label htmlFor="quantidade">Quantidade</label>
            <input
              type="number"
              name="quantidade"
              id="quantidade"
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value);
              }}
            />
          </div>
          <button
            style={{ marginTop: "1.15rem", marginLeft: "0.3rem" }}
            onClick={() => {
              if (!selected)
                return saudeContext.notify.error(
                  "Você precisa adicionar um medicamento antes de adiciona-lo!",
                  { position: "bottom-right" }
                );
              if (quantidade <= 0)
                return saudeContext.notify.error(
                  "Digite a Quantidade de medicamentos a serem adicionados!",
                  { position: "bottom-right" }
                );
              setSelected(undefined);
              setQuantidade(0);
              setTerm("");
              addMedicamentoToSelected({ ...selected, quantidade: quantidade });
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
      <span style={{ marginLeft: "0.5rem" }}>Medicamentos adicionados: </span>
      <div className="medicamentos-container">
        {medicamentosSelectedButtons &&
          medicamentosSelectedButtons.map((curr) => {
            return curr;
          })}
      </div>
    </div>
  );
}
