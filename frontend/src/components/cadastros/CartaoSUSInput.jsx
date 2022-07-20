import React from "react";
import InputMask from "react-input-mask";

export default function CartaoSUSInput({ value, setValue }) {
  return (
    <div className="form-item">
      <label htmlFor="cartao_sus">Número do cartão do SUS</label>
      <InputMask
        required={true}
        value={value}
        onChange={setValue}
        mask={"999 9999 9999 9999"}
      />
    </div>
  );
}
