import React, { useState } from "react";
import { useContext } from "react";
import Pacientes from "./cadastros/Pacientes";
import { UserContext } from "../contexts/UserContext";
import SideMenu, { SMButton } from "./SideMenu";
import Medicamentos from "./cadastros/Medicamentos";
export default function Cadastros() {
  const user = useContext(UserContext);
  const [active, setActive] = useState("");
  const getActive = () => {
    switch (active) {
      case "pacientes":
        return <Pacientes></Pacientes>;
      case "medicamentos":
        return <Medicamentos />;
      default:
        return <></>;
    }
  };
  return (
    <div className="main-component">
      <SideMenu titulo={"Cadastros"}>
        <SMButton
          value="Pacientes"
          onClick={() => {
            setActive("pacientes");
          }}
        ></SMButton>
        {user.currentUser.canUseFarmacia && (
          <SMButton
            value="Medicamentos"
            onClick={() => {
              setActive("medicamentos");
            }}
          ></SMButton>
        )}
      </SideMenu>
      <div className="content" key={active}>
        {getActive()}
      </div>
    </div>
  );
}
