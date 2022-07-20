import React from "react";
import CriarPacientesTest from "./testes/CriarPacientesTest";
import CriarUsuarioTest from "./testes/CriarUsuarioTest";

export default function Tests() {
  const style = {
    display: "flex",
    flexDirection: "column",
  };
  return (
    <div className="tests" style={style}>
      <CriarUsuarioTest />
      <CriarPacientesTest />
    </div>
  );
}
