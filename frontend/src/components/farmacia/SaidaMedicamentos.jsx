import React from "react";
import { useState } from "react";
import SaidaForm from "./SaidaForm";

export default function SaidaMedicamentos() {
  const [paciente, setPaciente] = useState("");
  return (
    <div className="main-content">
      <SaidaForm sendPaciente={setPaciente} />
    </div>
  );
}
