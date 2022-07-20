import React, { useContext, useEffect, useState } from "react";
import SideMenu, { SMButton } from "./SideMenu";
import api from "../services/api";
import "./Admin.css";
import { SaudeContext } from "../Saude";
import { ReactComponent as Editar } from "./static/pencil.svg";
import { ReactComponent as Deletar } from "./static/trash.svg";
import { ReactComponent as Fechar } from "./static/close.svg";
import FormItem from "./FormItem";
import Tests from "./admin/Tests";
import CPFInputField from "./cadastros/CPFInputField";

const CheckBox = ({ value, setValue, label }) => {
  return (
    <div className="form-option">
      <input
        type="checkbox"
        name={label}
        id={label}
        checked={value}
        value={value}
        onChange={(e) => {
          setValue((old) => !old);
        }}
      />
      <label htmlFor={label}> {label} </label>
    </div>
  );
};

const CriarUsuario = () => {
  const saudeContext = useContext(SaudeContext);
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [canUseFarmacia, setCanUseFarmacia] = useState(false);
  const [canUseMarcacao, setCanUseMarcacao] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const criarUsuario = () => {
    const token = localStorage.getItem("token");
    api
      .post(
        "/auth/user/create",
        {
          userToCreate: {
            name: name,
            cpf: cpf,
            email: email ? email : null,
            password: password,
            canUseFarmacia: canUseFarmacia,
            canUseMarcacao: canUseMarcacao,
            isAdmin: isAdmin,
          },
        },
        {
          headers: { authorization: "Bearer " + token },
        }
      )
      .then((succ) => {
        setCpf("");
        setName("");
        setEmail("");
        setCanUseFarmacia(false);
        setCanUseMarcacao(false);
        setIsAdmin(false);
        setPassword("");
        setRPassword("");
        saudeContext.notify.success("Usuário criado com sucesso!", {
          position: "bottom-right",
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        saudeContext.notify.error(
          `Erro ao criar usuário: ${err.response.data.message}`,
          { position: "bottom-right" }
        );
      });
  };

  useEffect(() => {
    if (password !== rPassword)
      return setPasswordError("Senha não confere, verifique as senhas!");
    setPasswordError("");
  }, [password, rPassword]);
  return (
    <form
      className="usuario-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        criarUsuario();
      }}
    >
      <h1 className="titulo">Criar novo usuário</h1>
      <div className="separador-menu"></div>
      <FormItem
        type="text"
        value={name}
        setValue={setName}
        label="Nome:"
        required={true}
      />
      <FormItem type="email" value={email} setValue={setEmail} label="Email:" />
      {passwordError && (
        <div
          className="login-info"
          style={{ position: "absolute", right: "1rem" }}
        >
          {passwordError}
        </div>
      )}
      <FormItem
        required={true}
        type="password"
        value={password}
        setValue={setPassword}
        label="Senha:"
      />
      <FormItem
        required={true}
        type="password"
        value={rPassword}
        setValue={setRPassword}
        label="Repita a Senha:"
      />
      <CPFInputField
        value={cpf}
        setValue={(e) => {
          setCpf(e.target.value);
        }}
      />
      <p>Permissões do usuário:</p>
      <div className="form-options">
        <CheckBox
          value={canUseFarmacia}
          setValue={setCanUseFarmacia}
          label="Farmácia"
        />
        <CheckBox
          value={canUseMarcacao}
          setValue={setCanUseMarcacao}
          label="Marcação"
        />
        <CheckBox value={isAdmin} setValue={setIsAdmin} label="Administrador" />
      </div>
      <input
        type="submit"
        value="Salvar"
        className="login-btn"
        style={{ width: "90%" }}
      />
    </form>
  );
};
const EditarUsuario = () => {
  const saudeContext = useContext(SaudeContext);
  const [search, setSearch] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [editingUser, setEditingUser] = useState();

  const UserOption = ({ user, setEditingUser }) => {
    return (
      <div className="user-option">
        <div className="user-info">{user.name}</div>
        <div className="user-info">{user.cpf}</div>
        <div className="user-info options" style={{ width: "10vw" }}>
          <button
            className="user-options-btn"
            onClick={() => {
              setEditingUser(user);
            }}
          >
            <Editar width={"1rem"} fill={"#f0c246"} />
          </button>
          <button className="user-options-btn">
            <Deletar width={"1rem"} fill={"var(--error)"} />
          </button>
        </div>
      </div>
    );
  };
  const EditUserForm = ({ user, setEditingUser, getUsersList }) => {
    const [cpf, setCpf] = useState(user.cpf);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email ? user.email : "");
    const [password, setPassword] = useState("");
    const [rPassword, setRPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [canUseFarmacia, setCanUseFarmacia] = useState(user.canUseFarmacia);
    const [canUseMarcacao, setCanUseMarcacao] = useState(user.canUseMarcacao);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin);
    const updatedUser = {
      _id: user._id,
      email: email,
      isAdmin: isAdmin,
      canUseFarmacia: canUseFarmacia,
      canUseMarcacao: canUseMarcacao,
      password: password,
    };
    const updateUser = () => {
      saudeContext.setLoading(true);
      api
        .post(
          "/user/update",
          { updatedUser },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          saudeContext.setLoading(false);
          setEditingUser(undefined);
          saudeContext.notify.success("Usuário atualizado com sucesso!", {
            position: "bottom-right",
          });
          getUsersList();
        })
        .catch((err) => {
          saudeContext.setLoading(false);
          saudeContext.notify.error(
            `Erro ao atualizar usuário: ${err.message}`,
            { position: "bottom-right" }
          );
        });
    };
    useEffect(() => {
      if (password !== rPassword)
        return setPasswordError("As senhas estão diferentes!");
      return setPasswordError("");
    }, [password, rPassword]);
    return (
      <div className="form-bg">
        <form
          action=""
          className="usuario-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <button
            className="user-options-btn"
            style={{ alignSelf: "end", margin: "0.5rem" }}
            onClick={() => {
              setEditingUser(undefined);
            }}
          >
            <Fechar width={"1rem"} />
          </button>
          {passwordError && (
            <div
              className="login-info"
              style={{ position: "absolute", right: "1rem" }}
            >
              {passwordError}
            </div>
          )}
          <h1 className="titulo">Editar usuário</h1>
          <div className="separador-menu"></div>
          <FormItem
            value={name}
            label={"Nome"}
            setValue={setName}
            type="text"
            disabled={true}
          />
          <FormItem
            value={cpf}
            label="CPF"
            setValue={setCpf}
            type="text"
            disabled={true}
          />
          <FormItem
            value={email}
            label="Email"
            setValue={setEmail}
            type="email"
          />
          <p>Alterar senha:</p>
          <FormItem
            value={password}
            label="Nova senha"
            type={"password"}
            setValue={setPassword}
          />
          <FormItem
            value={rPassword}
            label="Repetir nova senha"
            type={"password"}
            setValue={setRPassword}
          />
          <p>Permissões do usuário:</p>
          <div className="form-options">
            <CheckBox
              value={isAdmin}
              label={"Administratdor"}
              setValue={setIsAdmin}
            />
            <CheckBox
              value={canUseFarmacia}
              label={"Acesso à farmácia."}
              setValue={setCanUseFarmacia}
            />
            <CheckBox
              value={canUseMarcacao}
              label={"Acesso à marcação."}
              setValue={setCanUseMarcacao}
            />
          </div>
          <button
            className="login-btn"
            style={{ width: "90%" }}
            onClick={() => {
              updateUser();
            }}
          >
            Salvar
          </button>
        </form>
      </div>
    );
  };

  const getUsersList = () => {
    saudeContext.setLoading(true);
    let token = localStorage.getItem("token");
    api
      .post(
        "/users/get",
        { search: search },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((succ) => {
        setUsersList(succ.data.users);
        saudeContext.setLoading(false);
      })
      .catch((err) => {
        saudeContext.setLoading(false);
        console.log(err);
        saudeContext.notify.error(
          "Erro ao obter lista de usuários: " + err.message,
          {
            position: "bottom-right",
          }
        );
      });
  };

  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="users">
      {editingUser && (
        <EditUserForm
          user={editingUser}
          setEditingUser={setEditingUser}
          getUsersList={getUsersList}
        />
      )}
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="search-form"
      >
        <FormItem
          value={search}
          setValue={setSearch}
          label="Pesquisar Usuário"
        />
        <button
          onClick={() => {
            getUsersList();
          }}
        >
          Procurar
        </button>
      </form>
      <div className="headers">
        <div className="user-header">Nome</div>
        <div className="user-header">CPF</div>
        <div className="user-header" style={{ width: "10vw" }}>
          Ações
        </div>
      </div>
      {usersList &&
        usersList.map((curr) => {
          return (
            <UserOption
              key={curr._id}
              user={curr}
              setEditingUser={setEditingUser}
            />
          );
        })}
    </div>
  );
};

export default function Admin() {
  const [active, setActive] = useState("editarUsuario");
  const getActive = () => {
    switch (active) {
      case "criarUsuario":
        return (
          <div key={"Criar"} className="content">
            <CriarUsuario></CriarUsuario>;
          </div>
        );
      case "editarUsuario":
        return (
          <div key={"Editar"} className="content">
            <EditarUsuario></EditarUsuario>
          </div>
        );
      case "tests":
        return (
          <div key={"tests"} className="content">
            <Tests />
          </div>
        );
      default:
        return "";
    }
  };
  return (
    <div className="main-component">
      <SideMenu titulo={"Admin"}>
        <SMButton
          value={"Criar Novo Usuário"}
          onClick={(e) => {
            setActive("criarUsuario");
          }}
        />
        <SMButton
          value={"Editar Usuário"}
          onClick={(e) => {
            setActive("editarUsuario");
          }}
        />
        <SMButton
          value={"Testes"}
          onClick={(e) => {
            setActive("tests");
          }}
        />
      </SideMenu>
      <div className="content">{getActive()}</div>
    </div>
  );
}
