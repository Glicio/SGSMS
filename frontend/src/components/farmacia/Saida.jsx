import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SaudeContext } from "../../Saude";
import api from "../../services/api";
import BasicSearchForm from "../form/BasicSearchForm";
import { ReactComponent as Info } from "../static/info.svg";
import { ReactComponent as Fechar } from "../static/close.svg";
import { ReactComponent as Editar } from "../static/pencil.svg";
import { ReactComponent as Adicionar } from "../static/add.svg";
import { ReactComponent as Deletar } from "../static/trash.svg";
import "./Saida.css";
import SaidaForm from "../form/SaidaForm";

const InfoModal = ({ info, setInfo }) => {
  const data = new Date(info.data).toLocaleDateString("pt-br");
  return (
    <div
      className="modal-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(e) => {
        if (e.target.className === "modal-container") setInfo(undefined);
      }}
    >
      <div className="saida-info  pop-up-anim" style={{ position: "relative" }}>
        <button
          className="svg-btn"
          style={{ position: "absolute", right: "0.5rem" }}
          onClick={() => {
            setInfo(undefined);
          }}
        >
          <Fechar width={"0.5rem"} />
        </button>
        <h1 className="titulo">Informações</h1>
        <div className="separador-menu"></div>
        <span>Paciente: {info.paciente.name}</span>
        <span>Data: {data}</span>
        <span>Emitido por: {info.user.name}</span>
        <span>Itens:</span>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "40px",
            overflow: "visible",
          }}
        >
          {info.medicamentos.map((curr, index) => {
            return (
              <li key={index} style={{ overflow: "visible" }}>
                {curr.quantidade} {curr.unidade} de {curr.descricao}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const DeleteModal = ({ saidaToDelete, toggleSelf, refresh }) => {
  const saudeContext = useContext(SaudeContext);

  const data = new Date(saidaToDelete.data).toLocaleDateString("pt-br");
  console.log(saidaToDelete);
  const deleteSaida = (id) => {
    api
      .post("/saidas/delete", { id: id },{headers: {authorization: `Bearer ${localStorage.getItem("token")}`}})
      .then((result) => {
        saudeContext.notify.success("Excluído com sucesso!", {
          position: "botton-right",
        });
        toggleSelf()
        refresh()
      })
      .catch((err) => {
        console.error(err);
        saudeContext.notify.error("Erro ao excluir", {
          position: "botton-right",
        });
      });
  };

  return (
    <div
      className="modal-container"
      onMouseDown={(e) => {e.target.className === "modal-container" && toggleSelf()}}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="delete-prompt pop-up-anim">
        <h3>Atenção!</h3>
        <div className="separador-menu"></div>
        <span>Tem certeza que deseja deletar esta saída?</span>
        <span>Beneficiado: {saidaToDelete.paciente.name}</span>
        <span>Data: {data}</span>
        <div className="delete-opt">
          <button
          onClick={() => {
            deleteSaida(saidaToDelete._id)
          }}
          >Sim</button>
          <button
            onClick={() => {
              toggleSelf();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Saida() {
  const saudeContext = useContext(SaudeContext);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [saidas, setSaidas] = useState();
  const [info, setInfo] = useState(); // show info modal
  const [showSaidaForm, setShowSaidaForm] = useState(false);
  const [editando, setEditando] = useState();
  const [toDelete, setToDelete] = useState();
  



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

  const [buttons, setButtons] = useState(getPageButtons())


  const getSaidas = () => {
    saudeContext.setLoading(true);
    api
      .post(
        "/saidas/get",
        { search: search, limit: limit, page: page },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((result) => {
        setNumberOfPages(result.data.totalPages);
        setSaidas(result.data.saidas);
        saudeContext.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        saudeContext.setLoading(false);
        saudeContext.notify.error("Erro ao obter lista de saídas!", {
          position: "bottom-right",
        });
      });
  };

  useEffect(() => {
    getSaidas();
  }, []);

  useEffect(() => {
    getSaidas();
  }, [page]);

  useEffect(() => {
    setButtons(getPageButtons())
  },[numberOfPages,page])
  const closeForm = () => {
    setEditando(undefined);
    setShowSaidaForm(false);
  };

  const edit = (saidaToEdit) => {
    setEditando(saidaToEdit);
    setShowSaidaForm(true);
  };

  const closeDeleteModal = () => {
    setToDelete(undefined);
  };

  return (
    <div className="main-content">
      {showSaidaForm && (
        <SaidaForm saidaToEdit={editando} setSelf={closeForm} refresh={getSaidas}/>
      )}
      {toDelete && (
        <DeleteModal
          saidaToDelete={toDelete}
          toggleSelf={closeDeleteModal}
          refresh={getSaidas}
        />
      )}
      {info && <InfoModal info={info} setInfo={setInfo} />}
      <BasicSearchForm
        search={search}
        setSearch={setSearch}
        limit={limit}
        setLimit={setLimit}
        searchFunction={getSaidas}
      />
      <div
        className="header"
        style={{ display: "flex", width: "97.6%", position: "relative" }}
      >
        <h3 className="titulo">Saídas</h3>
        <button
          className="svg-btn"
          style={{ position: "absolute", right: "0", margin: "0.2rem" }}
          onClick={() => {
            setShowSaidaForm(true);
          }}
        >
          <Adicionar width="1rem" height="1rem" fill="white" />
        </button>
      </div>
      <div
        className="saidas-list"
        style={{ overflow: "scroll", height: "60%" }}
      >
        <table className="stable">
          <thead>
            <tr>
              <th>Beneficiado</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {saidas &&
              saidas.map((curr, index) => {
                const data = new Date(curr.data).toLocaleDateString("pt-br");
                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#d9d9d9" : "#a1a1a1",
                    }}
                  >
                    <td style={{width: "20rem", maxWidth: "20rem"}}>{curr.paciente.name}</td>
                    <td>{data}</td>
                    <td
                      style={{
                        display: "flex",
                        width: "7rem",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <button
                        className="svg-btn"
                        onClick={() => {
                          edit(curr);
                        }}
                      >
                        <Editar width="1rem" height="1rem" />
                      </button>
                      <button
                        className="svg-btn"
                        onClick={() => {
                          setInfo(curr);
                        }}
                      >
                        <Info width="1rem" height="1rem" />
                      </button>
                      <button
                        className="svg-btn"
                        onClick={() => {
                          setToDelete(curr);
                        }}
                      >
                        <Deletar width="1rem" height="1rem" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        
      </div>
      <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{buttons && buttons.map(curr => {return curr})}</div>
    </div>
  );
}
