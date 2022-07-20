import React from "react";
import FormItem from "../../FormItem";

export default function SearchMedicamentos({
  search,
  setSearch,
  limit,
  setLimit,
  doSearch,
}) {
  return (
    <form
      action=""
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormItem
        type={"text"}
        label="Procurar"
        value={search}
        setValue={setSearch}
      />

      <div className="form-item" style={{ maxWidth: "fit-content" }}>
        <label htmlFor="limit">Limite</label>
        <select
          style={{ height: "1.2rem", margin: "0.3rem" }}
          name="limit"
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
          }}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <button
        style={{
          height: "fit-content",
          minWidth: "fit-content",
          marginTop: "1.1rem",
        }}
        onClick={doSearch}
      >
        Procurar
      </button>
    </form>
  );
}
