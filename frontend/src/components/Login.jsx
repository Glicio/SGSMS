import React, { useContext, useState } from "react";
import "./Login.css";
import loginBg from "./static/login-bg.png";
import loginIcon from "./static/login-icon.png";
import CPFInputField from "./cadastros/CPFInputField";
const api = require("../services/api");
const { UserContext } = require("../contexts/UserContext");

export default function Login({ version, secName, setLoading }) {
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [loginError, setLoginError] = useState();
  const userContext = useContext(UserContext);

  const loginUser = async () => {
    let user = api.post("/auth/user/login", {
      cpf: cpf,
      password: password,
    });

    user
      .then((succ) => {
        localStorage.setItem("token", succ.data.token);
        localStorage.setItem("refreshToken", succ.data.refreshToken);
        setLoading(false);
        userContext.setCurrentUser((old) => succ.data.user);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setLoginError(
          err?.response?.data?.menssage
            ? err.response.data.menssage
            : "Erro de comunicação com o servidor, entre em contato com o suporte!"
        );
      });
  };

  return (
    <div className="login-container">
      <div className="login-bar">
        <div className="logo-div">
          <img src={loginIcon} alt="" className="login-logo" />
          <p>{secName}</p>
        </div>
        {loginError ? <div className="login-info">{loginError}</div> : ""}
        <form
          action=""
          onSubmit={(e) => e.preventDefault()}
          onChange={() => {
            setLoginError(undefined);
          }}
        >
          <CPFInputField value={cpf} setValue={(e) => setCpf(e.target.value)} />
          <div className="form-item">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-item">
            <input
              type="submit"
              value="Logar"
              className="login-btn"
              onClick={() => {
                loginUser();
                setLoading(true);
              }}
            />
          </div>
          <div className="app-info">
            Sistema de Gerenciamento <br />
            {version}
          </div>
        </form>
      </div>
      <div
        className="login-bg"
        style={{ backgroundImage: `url(${loginBg})` }}
      ></div>
    </div>
  );
}
