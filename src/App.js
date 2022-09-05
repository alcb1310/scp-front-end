import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Presupuesto from "./transacciones/presupuesto";
import Obra from "./transacciones/obra";
import Login from "./authentication/login";
import Navigation from "./nav/navigation";
import Footer from "./nav/footer";
import Partida from "./parametros/partida";
import Main from "./main";
import Proveedor from "./parametros/proveedor";
import Actual from "./reportes/actual";
import Factura from "./transacciones/factura";
import Usuarios from "./transacciones/usuarios/usuarios";
import ChangePassword from "./transacciones/usuarios/changepassword";
import ResetPassword from "./transacciones/usuarios/resetpassword";

function App() {
  const [token, setToken] = useState(store.getState().token.value);

  function saveToken(tokenData) {
    setToken(tokenData);
  }

  if (!token) {
    return (
      <Provider store={store}>
        <Login saveToken={saveToken} />
      </Provider>
    );
  }

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/transacciones/presupuesto" element={<Presupuesto />} />
          <Route path="/transacciones/obra" element={<Obra />} />
          <Route path="/transacciones/factura" element={<Factura />} />
          <Route path="/parametros/partida" element={<Partida />} />
          <Route path="/parametros/proveedor" element={<Proveedor />} />
          <Route path="/reportes/actual" element={<Actual />} />
          <Route path="/usuarios/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/change-password" element={<ChangePassword />} />
          <Route path="/usuarios/reset-password" element={<ResetPassword />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
        <Footer />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
