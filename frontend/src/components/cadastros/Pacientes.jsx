import React, { useContext, useEffect, useState } from "react";
import FormItem from "../FormItem";
import "./Pacientes.css";
import CPFInputField from "./CPFInputField";
import CartaoSUSInput from "./CartaoSUSInput";
import TelefoneInput from "./TelefoneInput";
import api from "../../services/api";
import { SaudeContext } from "../../Saude";
import { ReactComponent as Fechar } from "../static/close.svg";
import { ReactComponent as Editar } from "../static/pencil.svg";
import { ReactComponent as Adicionar } from "../static/add.svg";

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

const PacienteForm = ({ pacienteToEdit, toggleSelf, searchPacientes }) => {
  const saudeContext = useContext(SaudeContext);
  if (pacienteToEdit === {}) {
    pacienteToEdit = undefined;
  }
  const [paciente, setPaciente] = useState(
    pacienteToEdit !== undefined
      ? pacienteToEdit
      : {
          name: "",
          cpf: "",
          cartao_sus: "",
          agente_c_saude: "",
          telefone: "",
          email: "",
          endereco: "",
        }
  );
  const createPaciente = () => {
    api
      .post(
        "/paciente/create",
        { pacienteToCreate: paciente },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        saudeContext.notify.success(
          `Paciente ${paciente.name} criado com sucesso!`,
          { position: "bottom-right" }
        );
        searchPacientes();
        toggleSelf();
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

  const editPaciente = () => {
    api
      .post(
        "/paciente/update",
        { pacienteToUpdate: paciente },
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then(() => {
        saudeContext.notify.success("Paciente atualizado!", {
          position: "bottom-right",
        });
        toggleSelf();
        searchPacientes();
      })
      .catch((err) => {
        saudeContext.notify.error("Erro ao atualizar paciente!", {
          position: "bottom-right",
        });
        console.log(err);
      });
  };
  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") {
          toggleSelf();
        }
      }}
    >
      <form
        className="paciente-form pop-up-anim"
        action=""
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
          {pacienteToEdit ? `Editando Paciente` : "Incluir Paciente"}
        </h1>
        <div className="separador-menu"></div>

        <FormItem
          required
          type={"text"}
          value={paciente.name}
          label={"Nome"}
          setValue={(value) => {
            setPaciente((old) => {
              return { ...old, name: value };
            });
          }}
        />

        <CartaoSUSInput
          value={paciente.cartao_sus}
          setValue={(e) => {
            setPaciente((old) => {
              return { ...old, cartao_sus: e.target.value };
            });
          }}
        />
        <CPFInputField
          value={paciente.cpf}
          setValue={(e) => {
            setPaciente((old) => {
              return { ...old, cpf: e.target.value };
            });
          }}
        />
        <FormItem
          label={"Ag. Comunitário de saúde"}
          value={paciente.agente_c_saude}
          setValue={(value) => {
            setPaciente((old) => {
              return { ...old, agente_c_saude: value };
            });
          }}
        />
        <TelefoneInput />
        <FormItem
          label={"Email"}
          type={"email"}
          value={paciente.email}
          setValue={(value) => {
            setPaciente((old) => {
              return { ...old, email: value };
            });
          }}
        />
        <FormItem
          label={"Endereço"}
          type={"endereco"}
          value={paciente.endereco}
          setValue={(value) => {
            setPaciente((old) => {
              return { ...old, endereco: value };
            });
          }}
        />
        <button
          className="login-btn"
          style={{ alignSelf: "end", margin: "1.2rem", padding: "0.25rem" }}
          onClick={() => {
            if (paciente.cpf === "" || paciente.cartao_sus === "")
              return saudeContext.notify.error(
                "Os campos CPF e Cartão do SUS são obrigatórios!",
                { position: "bottom-right" }
              );

            if (!pacienteToEdit) {
              return createPaciente();
            }
            return editPaciente();
          }}
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(25);
  const [pacienteFormShow, setPacienteFormShow] = useState(false);
  const [page, setPage] = useState(1);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteToEdit, setPacienteToEdit] = useState();
  const [lastValidSearch, setLastValidSearch] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [pageButtons, setPageButtons] = useState([]);

  const nameCellWidth = "15rem";
  const cpfCellWidth = "8rem";
  const cartaoCellWidth = "10rem";
  const acsCellWidth = "15rem";
  const actionCellWidht = "5rem";

  const saudeContext = useContext(SaudeContext);

  const searchPacientes = (toSearch, toPage, toLimit) => {
    toSearch = toSearch ? toSearch : search;
    toPage = toPage ? toPage : page;
    toLimit = toLimit ? toLimit : limit;

    saudeContext.setLoading(true);
    getPacientesPaginated(toSearch, toPage, toLimit)
      .then((succ) => {
        setLastValidSearch(toSearch);
        setPacientes(succ.data.pacientes);
        setNumberOfPages(succ.data.totalPages);
        saudeContext.setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        saudeContext.notify.error(
          "Não foi possível obter a lista de pacientes!",
          { position: "bottom-right" }
        );
        saudeContext.setLoading(false);
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
    searchPacientes();
    setPageButtons(getPageButtons());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPageButtons(getPageButtons());
    // eslint-disable-next-line
  }, [numberOfPages]);

  useEffect(() => {
    setPageButtons(getPageButtons());
    searchPacientes(lastValidSearch, page, limit);
    // eslint-disable-next-line
  }, [page]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        action=""
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form-item">
          <label htmlFor="search">Procurar Paciente</label>
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div
          className="form-item"
          style={{ width: "fit-content", marginLeft: "0.25rem" }}
        >
          <label htmlFor="">Limite</label>
          <select
            name="limite"
            id="limite"
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
            }}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <button
          style={{
            minWidth: "fit-content",
            height: "fit-content",
            marginTop: "1.3em",
            marginLeft: ".3em",
          }}
          onClick={() => {
            setPage(1);
            searchPacientes(search, 1, limit);
          }}
        >
          Procurar
        </button>
      </form>
      {pacienteFormShow && (
        <PacienteForm
          searchPacientes={searchPacientes}
          pacienteToEdit={pacienteToEdit}
          toggleSelf={() => {
            setPageButtons(getPageButtons());
            setPacienteToEdit(undefined);
            setPacienteFormShow((old) => !old);
          }}
        />
      )}
      <div>
        <div
          style={{
            padding: "0 0.5em",
            display: "flex",
            backgroundColor: "var(--secondary-color)",
            color: "white",
          }}
        >
          <h1 className="titulo">Pacientes</h1>
          <button
            className="form-btn"
            style={{ marginLeft: "auto", alignSelf: "center" }}
            onClick={() => {
              setPacienteFormShow(true);
            }}
          >
            <Adicionar width="1rem" fill="white" />
          </button>
        </div>
        <div className="columns" style={{ display: "flex" }}>
          <div className="header" style={{ width: nameCellWidth }}>
            Nome
          </div>
          <div className="header" style={{ width: cpfCellWidth }}>
            CPF
          </div>
          <div className="header" style={{ width: cartaoCellWidth }}>
            Nº Cartão do Sus
          </div>
          <div className="header" style={{ width: acsCellWidth }}>
            Ag. Comunitário de Saúde
          </div>
          <div
            className="header"
            style={{
              width: "5.66rem",
            }}
          >
            Ações
          </div>
        </div>
      </div>
      <div className="pacientes-list">
        {pacientes &&
          pacientes.map((paciente, index) => {
            const backgroundColor = index % 2 === 0 ? "#FFFFFF" : "#dbd9d9";
            return (
              <div key={index} style={{ backgroundColor: backgroundColor }}>
                <div className="columns" style={{ display: "flex" }}>
                  <div
                    className="cell"
                    style={{
                      width: nameCellWidth,
                      borderLeft: "1px solid var(--secondary-color)",
                    }}
                  >
                    {paciente.name}
                  </div>
                  <div
                    className="cell"
                    style={{
                      width: cpfCellWidth,
                      borderLeft: "1px solid var(--secondary-color)",
                    }}
                  >
                    {paciente.cpf}
                  </div>
                  <div
                    className="cell"
                    style={{
                      width: cartaoCellWidth,
                      borderLeft: "1px solid var(--secondary-color)",
                    }}
                  >
                    {paciente.cartao_sus}
                  </div>
                  <div
                    className="cell"
                    style={{
                      width: acsCellWidth,
                      borderLeft: "1px solid var(--secondary-color)",
                    }}
                  >
                    {paciente.agente_c_saude}
                  </div>
                  <div
                    className="cell"
                    style={{
                      width: actionCellWidht,
                      borderInline: "1px solid var(--secondary-color)",
                    }}
                  >
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        marginInline: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setPacienteToEdit(paciente);
                        setPacienteFormShow(true);
                      }}
                    >
                      <Editar width="1rem" height="1rem"></Editar>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="pagination">
        {pageButtons.map((button) => {
          return button;
        })}
      </div>
    </div>
  );
}
