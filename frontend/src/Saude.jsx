import React, { createContext } from "react";
import "./Saude.css";
import bgImg from "./components/static/login-bg.png";
import toast, { Toaster } from "react-hot-toast";

export const SaudeContext = createContext();

export default function Saude({ children, setLoading, loading }) {
  const utils = {
    notify: toast,
    loading: loading,
    setLoading: setLoading,
  };
  return (
    <SaudeContext.Provider value={utils}>
      <div className="saude-app">
        <Toaster />
        <div
          className="saude-bg"
          style={{ backgroundImage: `url(${bgImg})` }}
        ></div>
        {children}
      </div>
    </SaudeContext.Provider>
  );
}
