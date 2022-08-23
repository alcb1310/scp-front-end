import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import "./login.scss";

import { save } from "../redux/token";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const url = process.env.REACT_APP_API_SERVER;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(`${url}/login`, {
        username: username,
        password: password,
      });
      dispatch(save(data.data.access_token));
      setError("");
      navigate("/");
    } catch (errorInfo) {
      console.log(errorInfo);
      setError(errorInfo.response.data.detail);
    }
  }

  const errorInfo = error ? error : null;

  return (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        <h1 className="pageTitle">Sistema Control Presupuestario</h1>
        <h3 className="subTitle">Ingrese al Sistema</h3>

        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <InputGroup size="sm">
                <InputGroup.Text id="username">Usuario</InputGroup.Text>
                <Form.Control
                  placeholder="username"
                  arialabel="username"
                  ariadescribedby="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </InputGroup>
              {errorInfo ? <p className="danger">{errorInfo}</p> : null}
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <InputGroup size="sm">
                <InputGroup.Text id="password">
                  Contrase&ntilde;a
                </InputGroup.Text>
                <Form.Control
                  placeholder="contraseña"
                  arialabel="contraseña"
                  ariadescribedby="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={{ span: 6, offset: 3 }}>
              <div className="buttonRow">
                <Button variant="outline-secondary">Cancelar</Button>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="ms-2"
                >
                  Ingresar
                </Button>
              </div>
            </Col>
          </Row>
        </form>
      </Col>
    </Row>
  );
}

export default Login;
