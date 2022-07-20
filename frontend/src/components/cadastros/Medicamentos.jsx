import React, { useState } from "react";
import MedicamentoForm from "./medicamentos/MedicamentoForm";
import { ReactComponent as Editar } from "../static/pencil.svg";
import { ReactComponent as Adicionar } from "../static/add.svg";
import SearchMedicamentos from "./medicamentos/SearchMedicamentos";
import api from "../../services/api";
import { useEffect } from "react";
import { useContext } from "react";
import { SaudeContext } from "../../Saude";
import "./Medicamentos.css";

export default function Medicamentos() {
  const saudeContext = useContext(SaudeContext);
  const descCellSize = "70%";
  const unidCellSize = "30%";
  const [medicamentosList, setMedicamentosList] = useState();
  const [search, setSearch] = useState("");
  const [lastValidSearch, setLastValidSearch] = useState("");
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [pageButtons, setPageButtons] = useState();

  const getMedicamentosPaginated = (search, page, limit) => {
    saudeContext.setLoading(true);

    api
      .post(
        "/medicamentos/get",
        { search: search, page: page, limit: limit },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((result) => {
        saudeContext.setLoading(false);
        setLastValidSearch(search);
        setMedicamentosList(result.data.medicamentos);
        setNumberOfPages(result.data.totalPages);
      })
      .catch((err) => {
        saudeContext.setLoading(false);
        console.log(err);
      });
  };

  const getPageButtons = () => {
    let options = [];

    for (let i = 1; i <= numberOfPages; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    let btns = [
      <button
        key={"prev"}
        className="pageButtom"
        disabled={page === 1}
        onClick={() => {
          setPage((old) => {
            return old - 1;
          });
        }}
      >
        Anterior
      </button>,
      <select
        key={"asdasdsadsa"}
        name="page"
        id="page"
        value={page}
        onChange={(e) => {
          setPage(parseInt(e.target.value));
        }}
      >
        {options.map((curr) => curr)}
      </select>,
      <button
        key={"next"}
        className="pageButtom"
        disabled={page === numberOfPages}
        onClick={() => {
          setPage((old) => {
            return old + 1;
          });
        }}
      >
        Próximo
      </button>,
    ];

    return btns;
  };

  useEffect(() => {
    getMedicamentosPaginated();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPageButtons(getPageButtons());
    // eslint-disable-next-line
  }, [numberOfPages]);

  useEffect(() => {
    setPageButtons(getPageButtons());
    getMedicamentosPaginated(lastValidSearch, page, limit);
    // eslint-disable-next-line
  }, [page]);
  const [medicamento, setMedicamento] = useState({
    descricao: "",
    unidade: "",
  });
  const [showMedicamentoForm, setShowMedicamentoForm] = useState(false);

  const toggleMedicamentosForm = () => {
    if (showMedicamentoForm === true)
      getMedicamentosPaginated(lastValidSearch, page, limit);
    setShowMedicamentoForm((old) => !old);
  };

  const setMedicamentoToEdit = (medicamento) => {
    setMedicamento(medicamento);
    toggleMedicamentosForm();
  };

  return (
    <div className="main-content">
      {showMedicamentoForm && (
        <MedicamentoForm
          medicamento={medicamento}
          setMedicamento={setMedicamento}
          toggleSelf={toggleMedicamentosForm}
        />
      )}
      <SearchMedicamentos
        search={search}
        setSearch={setSearch}
        limit={limit}
        setLimit={setLimit}
        doSearch={() => {
          setPage(1);
          getMedicamentosPaginated(search, page, limit);
        }}
      />
      <div
        style={{
          padding: "0 0.5em",
          display: "flex",
          backgroundColor: "var(--secondary-color)",
          color: "white",
        }}
      >
        <h1 className="titulo">Medicamentos</h1>
        <button
          className="form-btn"
          style={{ marginLeft: "auto", alignSelf: "center" }}
          onClick={() => {
            toggleMedicamentosForm();
          }}
        >
          <Adicionar width="1rem" fill="white" />
        </button>
      </div>
      <div className="columns" style={{ display: "flex", width: "30rem" }}>
        <div className="header" style={{ width: descCellSize }}>
          Descrição
        </div>
        <div className="header" style={{ width: unidCellSize }}>
          Unidade
        </div>
        <div className="header" style={{ width: unidCellSize }}>
          Ações
        </div>
      </div>

      <div className="medicamentos-list">
        {medicamentosList &&
          medicamentosList.map((curr, index) => {
            const color = index % 2 === 0 ? "#FFFFFF" : "#dbd9d9";
            return (
              <div
                className="row"
                key={index}
                style={{
                  display: "flex",
                  width: "30rem",
                  backgroundColor: color,
                }}
              >
                <div
                  className="cell"
                  style={{
                    width: descCellSize,
                    borderLeft: "1px solid var(--primary-color)",
                  }}
                >
                  {curr.descricao}
                </div>
                <div
                  className="cell"
                  style={{
                    width: unidCellSize,
                    borderLeft: "1px solid var(--primary-color)",
                  }}
                >
                  {curr.unidade}
                </div>
                <div
                  className="cell"
                  style={{
                    width: unidCellSize,
                    borderInline: "1px solid var(--primary-color)",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMedicamentoToEdit(curr);
                    }}
                  >
                    <Editar width={"1rem"} height={"1rem"} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className="pagination" style={{ marginTop: "1rem " }}>
        {pageButtons && pageButtons.map((curr) => curr)}
      </div>
    </div>
  );
}
