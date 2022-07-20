import React from "react";
import InputMask from "react-input-mask";

export default function TelefoneInput({ value, setValue }) {
  return (
    <div className="form-item">
      <label htmlFor="telefone">Telefone</label>
      <InputMask value={value} onChange={setValue} mask={"(99) 9 9999-9999"} />
    </div>
  );
}
