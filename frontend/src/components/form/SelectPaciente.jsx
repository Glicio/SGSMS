import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import { SaudeContext } from "../../Saude";
import { ReactComponent as Confirmed } from "../static/confirm.svg";
import { ReactComponent as Editar } from "../static/pencil.svg";
import "./SelectPaciente.css";

const SEARCH_TIME = 300;

const getPacientesPaginated = (search, page, limit) => {
  const token = localStorage.getItem("token");
  return api.post(
    "/paciente/get",
    { search: search, page: page, limit: limit },
    {
      headers: { authorization: "Bearer " + token },
    }
  );
};

export default function SelectPaciente({ setPaciente }) {
  const [term, setTerm] = useState("");
  const [termToSearch, setTermToSearch] = useState();
  const [pacienteList, setPacienteList] = useState();
  const [selected, setSelected] = useState();
  const saudeContext = useContext(SaudeContext);

  const getPacientesButtons = () => {
    if (!pacienteList) return;
    if (pacienteList.length === 0) {
      return [
        <button
          key={"naoencontrado"}
          className="selectButton"
          onClick={(e) => {
            setPacienteList();
          }}
        >
          Não encontrado!
        </button>,
      ];
    }
    let res = [];

    for (let paciente of pacienteList) {
      res = [
        ...res,
        <button
          key={paciente.cpf}
          className="selectButton"
          onClick={(e) => {
            setPacienteList();
            setSelected(paciente);
            setPaciente(paciente);
          }}
        >
          {paciente.name} | {paciente.cpf}
        </button>,
      ];
    }

    return res;
  };

  useEffect(() => {
    setPacienteList(undefined);
    setSelected(undefined);
    setPaciente(undefined);
    const termTimeOut = setTimeout(() => {
      setTermToSearch(term);
    }, SEARCH_TIME);
    return () => clearTimeout(termTimeOut);
  }, [term]);

  useEffect(() => {
    if (!termToSearch) {
      setTerm("");
      setPacienteList(undefined);
      return;
    }
    getPacientesPaginated(term, 1, 5)
      .then((result) => {
        setPacienteList(result.data.pacientes);
      })
      .catch((err) => {
        saudeContext.notify.error(
          "Não foi possível obter a lista de pacientes!",
          { position: "bottom-right" }
        );
      });
    // eslint-disable-next-line
  }, [termToSearch]);
  return (
    <div
      className="form-item"
      style={{ with: "25rem", overflow: "visible" }}
      onBlur={(e) => {
        setTimeout(() => {
          setPacienteList(undefined);
        }, 300);
      }}
    >
      <div
        className="form-item"
        style={{
          position: "",
          overflow: "visible",
          width: "15rem",
        }}
      >
        <label htmlFor="name">Paciente</label>
        <div className="" style={{ display: "flex" }}>
          {selected ? (
            <input
              className="pacienteInput"
              type={"text"}
              disabled
              value={selected.name}
              readOnly
            />
          ) : (
            <input
              type="text"
              className="pacienteInput"
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
                  setPaciente(undefined);
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
          }}
        >
          <div
            className="results-list"
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              left: "0",
            }}
          >
            {pacienteList && getPacientesButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}
