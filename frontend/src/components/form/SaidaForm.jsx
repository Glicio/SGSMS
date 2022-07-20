import React, { useState } from "react";
import { ReactComponent as Adicionar } from "../static/add.svg";
import { ReactComponent as Deletar } from "../static/trash.svg";
import { ReactComponent as Mais } from "../static/plus.svg";
import { ReactComponent as Menos } from "../static/minus.svg";
import { ReactComponent as Fechar } from "../static/close.svg";

import "./SaidaForm.css";
import { useEffect } from "react";
import api from "../../services/api";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { SaudeContext } from "../../Saude";

//styles
const formItemStyle = {
  width: "fit-content",
  color: "white",
  padding: "0.5rem",
};

const labelStyle = {
  fontWeight: "bold",
};

//end styles

// sub menus =======================================================
const SelectBeneficiado = ({ setBeneficiado, setSelf }) => {
  const [search, setSearch] = useState("");
  const [searchDebouncer, setSearchDebouncer] = useState("");
  const [pacientesList, setPacientesList] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDebouncer);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchDebouncer]);

  useEffect(() => {
    search !== "" &&
      api
        .post(
          "/paciente/get",
          { search: search, limit: 5, page: 1 },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((result) => {
          setPacientesList(result.data.pacientes);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [search]);

  const selectPaciente = (paciente) => {
    setBeneficiado(paciente);
    setSelf();
  };

  return (
    <div
      className="modal-container sub-modal"
      onMouseDown={(e) => {
        e.target.className === "modal-container sub-modal" && setSelf();
      }}
    >
      <div className="sub-select">
        <div>
          <h3 style={{ color: "white" }}>Selecionar Beneficiado</h3>
          <div className="separador-menu"></div>
        </div>
        <div className="form-item">
          <label htmlFor="search">Procurar</label>
          <input
            type="text"
            name="search"
            id="search"
            value={searchDebouncer}
            onChange={(e) => {
              setSearchDebouncer(e.target.value);
            }}
          />
        </div>
        <table className="pacientes-table">
          <thead>
            <tr>
              <td>Nome</td>
              <td>CPF</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {pacientesList ? (
              pacientesList.map((curr, index) => {
                return (
                  <tr key={index}>
                    <td style={{ maxWidth: "10rem" }}>{curr.name}</td>
                    <td>{curr.cpf}</td>
                    <td>
                      <button
                        onClick={() => {
                          selectPaciente(curr);
                        }}
                      >
                        Selecionar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"3"}>Nada encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SelectMedicamento = ({ addMedicamento, setSelf }) => {
  const [search, setSearch] = useState("");
  const [searchDebouncer, setSearchDebouncer] = useState("");
  const [medicamentos, setMedicamentos] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDebouncer);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchDebouncer]);

  useEffect(() => {
    search !== "" &&
      api
        .post(
          "/medicamentos/get",
          { search: search, limit: 5, page: 1 },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((result) => {
          setMedicamentos(result.data.medicamentos);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [search]);

  return (
    <div
      className="modal-container sub-modal"
      onMouseDown={(e) => {
        e.target.className === "modal-container sub-modal" && setSelf();
      }}
    >
      <div className="sub-select">
        <div>
          <h3>Adicionar Medicamento</h3>
          <div className="separdor-menu"></div>
          <div className="form-item">
            <label htmlFor="search">Procurar</label>
            <input
              type="text"
              value={searchDebouncer}
              onChange={(e) => {
                setSearchDebouncer(e.target.value);
              }}
            />
          </div>
          <table className="paciente-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Unidade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {medicamentos ? (
                medicamentos.map((curr, index) => {
                  return (
                    <tr key={index}>
                      <td>{curr.descricao}</td>
                      <td>{curr.unidade}</td>
                      <td>
                        <button
                          onClick={() => {
                            addMedicamento(curr);
                          }}
                        >
                          Selecionar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={"2"}>Nada Encontrado!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// end sub menus ===================================================

export default function SaidaForm({ saidaToEdit, setSelf, refresh }) {
  const [showSelectBeneficiado, setShowSelectBeneficiado] = useState(false);
  const [showSelectMedicamento, setSelectMedicamento] = useState(false);
  const [saida, setSaida] = useState(
    saidaToEdit !== undefined
      ? saidaToEdit
      : {
          paciente: undefined,
        }
  );
  const userContext = useContext(UserContext);
  const saudeContext = useContext(SaudeContext)

  useEffect(() => {
    console.log(saida);
  }, [saida]);

  const insertSaida = () => {
    if(!saida.paciente || !saida.medicamentos) {
      saudeContext.notify.error("É preciso informar um paciente e ao menos um item!", {position: "bottom-right"})
      return
    }
    api.post(
      "/saidas/create/",
      {
        saida: {
          medicamentos: saida.medicamentos,
          paciente: saida.paciente,
          data: Date.now(),
          user: userContext.currentUser,
        },
      },
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).then(() => {
      saudeContext.notify.success("Saída inserida com sucesso!", {position: "bottom-right"})
      setSelf()
      refresh()
    }).catch((err) => {
      console.error(err)
      saudeContext.notify.error("Erro ao inserir saída!", {position: "bottom-right"})
    });
  };

  const saveEdited = () => {
    api.post(
      "/saidas/update/",
      {
        saida: {
          _id: saida._id,
          medicamentos: saida.medicamentos,
          paciente: saida.paciente,
        },
      },
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    ).then(() => {
      saudeContext.notify.success("Saída editada com sucesso!", {position: "bottom-right"})
      setSelf()
      refresh()
    }).catch((err) => {
      console.error(err)
      saudeContext.notify.error("Erro ao editar saída!", {position: "bottom-right"})
    });
  }

  const setBeneficiado = (paciente) => {
    setSaida((old) => {
      return { ...old, paciente: paciente };
    });
  };

  const addMedicamento = (medicamento) => {
    setSaida((old) => {
      const lista = old.medicamentos ? old.medicamentos : [];
      return {
        ...old,
        medicamentos: [...lista, { ...medicamento, quantidade: 1 }],
      };
    });
    setSelectMedicamento(false);
  };

  const addQuantidade = (id) => {
    setSaida((old) => {
      var lista = old.medicamentos ? old.medicamentos : [];
      lista[id].quantidade++;
      return {
        ...old,
        medicamentos: lista,
      };
    });
  };

  const subQuantidade = (id) => {
    setSaida((old) => {
      var lista = old.medicamentos ? old.medicamentos : [];
      lista[id].quantidade > 1 && lista[id].quantidade--;
      return {
        ...old,
        medicamentos: lista,
      };
    });
  };

  const removeMedicamento = (id) => {
    setSaida((old) => {
      var lista = old.medicamentos ? old.medicamentos : [];
      return {
        ...old,
        medicamentos: lista.filter((curr, index) => {
          return index !== id;
        }),
      };
    });
  };

  return (
    <div
      className="modal-container"
      onMouseDown={(e) => {
        e.target.className === "modal-container" && setSelf();
      }}
    >
      {showSelectMedicamento && (
        <SelectMedicamento
          addMedicamento={addMedicamento}
          setSelf={() => {
            setSelectMedicamento(false);
          }}
        />
      )}
      {showSelectBeneficiado && (
        <SelectBeneficiado
          setBeneficiado={setBeneficiado}
          setSelf={() => {
            setShowSelectBeneficiado(false);
          }}
        />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="pop-up-anim"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--primary-color)",
          height: "fit-content",
          minWidth: "30rem",
          padding: "0.5rem",
          marginTop: "3rem",
        }}
      >
        <div
          style={{ width: "100%", position: "relative", overflow: "visible" }}
        >
          <button
            className="svg-btn"
            style={{ position: "absolute", right: "1rem", zIndex: "99" }}
            onClick={() => {
              setSelf(false);
            }}
          >
            <Fechar width="1rem" />
          </button>
        </div>
        <h1
          className="titulo"
          style={{
            color: "white",
            textShadow: "-1px 1px 1px black",
            marginLeft: "2rem",
          }}
        >
          {saida._id ? "Editar Saída" : "Incluir Saída"}
        </h1>
        <div className="separador-menu" style={{ alignSelf: "center" }}></div>
        <div className="form-item" style={formItemStyle}>
          <label htmlFor="" style={labelStyle}>
            Beneficiado
          </label>
          <div style={{ display: "flex" }}>
            {saida.paciente ? (
              <span
                style={{
                  display: "flex",
                  width: "20rem",
                  whiteSpace: "nowrap",
                }}
              >
                {"Selecionado: "}
                &nbsp;
                <b>{saida.paciente.name}</b>
              </span>
            ) : (
              <span>Selecionado: Nenhum</span>
            )}
            <button
              style={{ marginLeft: "1rem", height: "1.2rem", alignSelf: "end" }}
              onClick={() => {
                setShowSelectBeneficiado(true);
              }}
            >
              Selecionar
            </button>
          </div>
        </div>
        <div className="form-item" style={{ ...formItemStyle, width: "100%" }}>
          <label htmlFor="" style={{ ...labelStyle, display: "flex" }}>
            <span>Itens</span>
            <button
              className="svg-btn"
              style={{ margin: "0 0.5rem" }}
              onClick={() => setSelectMedicamento(true)}
            >
              <Adicionar width={"1rem"} fill={"white"} />
            </button>
          </label>
        </div>
        <table className="medicamentos-list-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {saida.medicamentos &&
              saida.medicamentos.map((curr, index) => {
                return (
                  <tr key={index}>
                    <td style={{ maxWidth: "15rem", whiteSpace: "nowrap" }}>
                      {curr.descricao}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className="svg-btn"
                        style={{ margin: "0 0.5rem" }}
                        onClick={() => {
                          subQuantidade(index);
                        }}
                      >
                        <Menos width="1rem" />
                      </button>
                      {curr.quantidade} {curr.unidade.toUpperCase()}(S)
                      <button
                        className="svg-btn"
                        style={{ margin: "0 0.5rem" }}
                        onClick={() => {
                          addQuantidade(index);
                        }}
                      >
                        <Mais width="1rem" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="svg-btn"
                        style={{ marginInline: "auto" }}
                        onClick={() => {
                          removeMedicamento(index);
                        }}
                      >
                        <Deletar width="1rem" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <button
          className="login-btn"
          style={{ alignSelf: "end", margin: "0.5rem" }}
          onClick={() => {
            saida._id ? saveEdited() : insertSaida()
          }}
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
