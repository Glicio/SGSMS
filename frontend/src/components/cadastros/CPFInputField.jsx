import React from "react";
import InputMask from "react-input-mask";

export default function CPFInputField({ value, setValue }) {
  return (
    <div className="form-item">
      <label htmlFor="cpf">CPF</label>
      <InputMask
        required
        value={value}
        onChange={setValue}
        mask={"999.999.999-99"}
      />
    </div>
  );
}
