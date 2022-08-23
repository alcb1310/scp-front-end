import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";
import Presupuesto from "./transacciones/presupuesto";
import Obra from "./transacciones/obra";
import Login from "./authentication/login";
import Navigation from "./nav/navigation";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import Footer from "./nav/footer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />} />
        <Route exact path="/login" element={<Login />} />
        <Route path="/transacciones/presupuesto" element={<Presupuesto />} />
        <Route path="/transacciones/obra" element={<Obra />} />
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
