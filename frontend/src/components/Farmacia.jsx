import React from "react";
import { useState } from "react";
import Saida from "./farmacia/Saida";
import SaidaMedicamentos from "./farmacia/SaidaMedicamentos";
import SideMenu, { SMButton } from "./SideMenu";

export default function Farmacia() {
  const [active, setActive] = useState("SaidaMedicamentosV2");

  const getActive = (active) => {
    switch (active) {
      case "SaidaMedicamentosV2":
        return <Saida />;
      default:
        return "";
    }
  };

  return (
    <div className="main-component">
      <SideMenu titulo={"Farmácia"}>
        <SMButton
          value={"Saídas de Medicamentos"}
          onClick={() => setActive("SaidaMedicamentosV2")}
        ></SMButton>
      </SideMenu>
      <div className="content" key={active}>
        {getActive(active)}
      </div>
    </div>
  );
}
