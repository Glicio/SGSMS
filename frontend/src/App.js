import { useContext, useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import { UserContext } from "./contexts/UserContext";
import NavBar from "./components/NavBar";
import Saude from "./Saude";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Farmacia from "./components/Farmacia";
import Marcacao from "./components/Marcacao";
import Admin from "./components/Admin";
import Cadastros from "./components/Cadastros";

const api = require("./services/api");
const version = "1.0 Alpha";
const secName = "Secretaria Municipal de Saúde de Monteirópolis/AL";

export const LoadingComponent = () => {
  return (
    <div className="loading-div">
      <div className="loader"></div>
    </div>
  );
};

function App() {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/auth/user/validate", {
        headers: { authorization: "Bearer " + token },
      })
      .then((succ) => user.setCurrentUser(succ.data))
      .catch((err) =>
        console.info(
          "%cUsuário não logado ou tonken sem validade!",
          "color: blue; background-color: white;"
        )
      );

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="app-container">
      {loading && <LoadingComponent />}
      {user.currentUser ? (
        <Saude setLoading={setLoading} loading={loading}>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" />
              {user.currentUser.canUseFarmacia && (
                <Route path="/farmacia" element={<Farmacia></Farmacia>} />
              )}

              {user.currentUser.canUseMarcacao && (
                <Route path="/marcacao" element={<Marcacao></Marcacao>} />
              )}

              {user.currentUser.isAdmin && (
                <Route path="/admin" element={<Admin></Admin>} />
              )}
              {user.currentUser && (
                <Route path="/cadastros" element={<Cadastros />} />
              )}
            </Routes>
          </BrowserRouter>
        </Saude>
      ) : (
        <Login
          version={version}
          secName={secName}
          setLoading={setLoading}
        ></Login>
      )}
    </div>
  );
}

export default App;
