import React from "react";

export default function BasicSearchForm({
  search,
  setSearch,
  limit,
  setLimit,
  searchFunction,
}) {
  return (
    <div className="" style={{ display: "flex", width: "100%" }}>
      <div className="form-item" style={{ marginInline: "0.2rem" }}>
        <label htmlFor="search">Procurar</label>
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="form-item" style={{ width: "5rem" }}>
        <label htmlFor="limit">Limite</label>
        <select
          name="limit"
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(e.target.value);
          }}
        >
          <option value="20">20</option>
          <option value="20">50</option>
          <option value="20">100</option>
        </select>
      </div>

      <button
        onClick={() => {
          searchFunction();
        }}
        style={{
          minWidth: "fit-content",
          height: "1.2rem",
          marginTop: "1.3rem",
          marginInline: "0.2rem",
        }}
      >
        Procurar
      </button>
    </div>
  );
}
