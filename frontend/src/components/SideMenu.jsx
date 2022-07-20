import React from "react";
import "./SideMenu.css";

export const SMButton = ({ onClick, value }) => {
  value = value ? value : "Botão";
  onClick = onClick
    ? onClick
    : (e) => {
        console.log(
          `%cNão foi definido um onClick para o botão que você clicou!`,
          "color: cyan;"
        );
        console.log(e);
      };
  return (
    <button
      className="SDMButton"
      onClick={(e) => {
        onClick(e);
      }}
    >
      {value}
    </button>
  );
};

export default function SideMenu({ children, titulo }) {
  titulo = titulo ? titulo : "Menu";
  return (
    <div className="menu">
      <h1>{titulo}</h1>
      <div className="separador-menu"></div>
      {children}
    </div>
  );
}
