import React from "react";

export default function Icon({ icon }) {
  const size = 32;
  return (
    <img
      src={icon}
      alt=""
      style={{ width: `${size * 1.2}px`, height: `${size}px` }}
    />
  );
}
