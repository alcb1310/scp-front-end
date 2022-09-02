import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.scss";
import "./navigation.scss"
import { useSelector } from "react-redux";

function Navigation() {
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const opciones = {
    Inicio: [],
    Transacciones: ["obra", "presupuesto", "factura", "cierre mes"],
    Reportes: ["cuadre", "control actual"],
    Parametros: ["partida", "proveedor"],
    Usuario: ["crear", "cambiar contraseña", "resetear contraseña"],
  };
  const token = useSelector((state) => state.token.value);

  const handleClick = (idx) => {
    switch (idx) {
      case 2:
        setSelectedMenu("Transacciones");
        break;
      case 3:
        setSelectedMenu("Reportes");
        break;
      case 4:
        setSelectedMenu("Parametros");
        break;
      case 5:
        setSelectedMenu("Usuario");
        break;
      default:
        setSelectedMenu("Inicio");
    }
  };

  const opcionesEl = opciones[selectedMenu].map((subMenuItem, index) => {
    let selectedMenuItem = subMenuItem.toLowerCase()
    if (subMenuItem === "control actual"){
      selectedMenuItem = "actual"
    }
    return (
      <li key={index}>
        <NavLink
          to={`../${selectedMenu.toLowerCase()}/${selectedMenuItem}`}
          className={"SubMenuItem"}
        >
          {subMenuItem}
        </NavLink>
      </li>
    );
  });

  const subMenuInfo = (
    <>
      <nav className="SubMenuBar">
        <ul className="SubMenuList">{opcionesEl}</ul>
      </nav>
    </>
  );

  const displayMenu = token ? (
    <header>
      <h1 className="PageName">Sistema Control Presupuestario</h1>
      <nav className="NavBar">
        <ul className="NavBarList">
          <li>
            <NavLink
              to="../"
              className={`NavBarListItem ${
                selectedMenu === "Inicio" ? "Selected" : ""
              }`}
              onClick={() => handleClick(1)}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to=""
              className={`NavBarListItem ${
                selectedMenu === "Transacciones" ? "Selected" : ""
              }`}
              onClick={() => handleClick(2)}
            >
              Transacciones
            </NavLink>
          </li>
          <li>
            <NavLink
              to=""
              className={`NavBarListItem ${
                selectedMenu === "Reportes" ? "Selected" : ""
              }`}
              onClick={() => handleClick(3)}
            >
              Reportes
            </NavLink>
          </li>
          <li>
            <NavLink
              to=""
              className={`NavBarListItem ${
                selectedMenu === "Parametros" ? "Selected" : ""
              }`}
              onClick={() => handleClick(4)}
            >
              Par&aacute;metros
            </NavLink>
          </li>
          <li>
            <NavLink
              to=""
              className={`NavBarListItem ${
                selectedMenu === "Usuario" ? "Selected" : ""
              }`}
              onClick={() => handleClick(5)}
            >
              Usuarios
            </NavLink>
          </li>
        </ul>
      </nav>
      {opcionesEl.length > 0 ? subMenuInfo : ""}
    </header>
  ) : null

  return (<>{displayMenu}</>);
}

export default Navigation;
