import React, { useContext } from "react";
import "./NavBar.css";
import { UserContext } from "../contexts/UserContext";
import { ReactComponent as SairSvg } from "./static/sair-svg.svg";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div className="nav-bar">
      <span className="logo">SGSMS</span>
      <div className="separador"></div>
      <button
        className="nav-btn"
        onClick={() => {
          navigate("/cadastros");
        }}
      >
        Cadastros
      </button>
      <button
        className={`nav-btn ${
          user.currentUser.canUseFarmacia ? "" : "disabled"
        }`}
        onClick={() => {
          if (user.currentUser.canUseFarmacia) navigate("/farmacia");
        }}
      >
        Farmácia
      </button>
      <button
        className={`nav-btn ${
          user.currentUser.canUseMarcacao ? "" : "disabled"
        }`}
        onClick={() => {
          if (user.currentUser.canUseMarcacao) navigate("/marcacao");
        }}
      >
        Marcações
      </button>
      {user.currentUser.isAdmin && (
        <button
          className="nav-btn"
          onClick={() => {
            if (user.currentUser.isAdmin) navigate("/admin");
          }}
        >
          Admin
        </button>
      )}
      <button
        style={{ position: "absolute", right: "2rem" }}
        className="nav-btn"
        onClick={(e) => {
          user.clearUser();
          navigate("/");
        }}
      >
        Sair 
        <SairSvg width="1rem" height="1rem" fill="black" />
      </button>
    </div>
  );
}
