import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Table,
  Row,
  Col,
  Modal,
  InputGroup,
  Form,
} from "react-bootstrap";

function Obra() {
  const token = useSelector((state) => state.token.value);
  const [obras, setObras] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState("");
  const [selectedObra, setSelectedObra] = useState({
    nombre: "",
    casas: "",
    activo: false,
    uuid: "",
  });
  const [screenUpdate, setScreenUpdate] = useState(true);
  
  const url = process.env.REACT_APP_API_SERVER;
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  useEffect(() => {
    axios.get(`${url}/api/obras`, config).then((data) => setObras(data.data.data));
  }, [url, token, config, screenUpdate]);

  useEffect(() => {
    axios
      .get(`${url}/api/obras/${selectedUuid}`, config)
      .then((data) => setSelectedObra(data.data))
      .catch(() => {
        setSelectedObra({
          nombre: "",
          casas: "",
          activo: false,
          uuid: "",
        });
      });
  }, [selectedUuid, config, url]);

  function handleModalClick() {
    setShow((prevShow) => !prevShow);
  }

  function handleEditClick(uuid) {
    setSelectedUuid(uuid);
    handleModalClick();
  }

  function handleCrear() {
    setSelectedUuid("");
    handleModalClick();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedObra.uuid) {
      axios
        .put(
          `${url}/api/obras/${selectedObra.uuid}`,
          {
            nombre: selectedObra.nombre,
            casas: selectedObra.casas,
            activo: selectedObra.activo,
          },
          config
        )
        .then((data) => {
          console.log(data);
        })
        .finally(() => {
          setScreenUpdate((prev) => !prev);
        });
    } else {
      console.log(selectedObra);
      axios
        .post(
          `${url}/api/obras`,
          {
            nombre: selectedObra.nombre,
            casas: selectedObra.casas,
            activo: selectedObra.activo ? selectedObra.activo : false,
          },
          config
        )
        .then((data) => setSelectedUuid(data.data.uuid))
        .finally(() => {
          setScreenUpdate((prev) => !prev);
        });
    }
    setScreenUpdate((prev) => !prev);
  }

  function handleChange(event) {
    const { value, name, type, checked } = event.target;
    setSelectedObra((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "casas"
          ? parseInt(value)
          : value,
    }));
  }

  const obrasEl = obras.map((obra) => {
    return (
      <tr
        key={obra.id}
        id={obra.uuid}
        onClick={() => handleEditClick(obra.uuid)}
      >
        <td>{obra.nombre}</td>
        <td>{obra.casas}</td>
        <td>
          <FontAwesomeIcon icon={obra.activo ? faCheck : faXmark} />
        </td>
      </tr>
    );
  });

  return (
    <>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Obra</h3>
          <div align="right">
            <Button variant="outline-primary" onClick={handleCrear}>
              Crear
            </Button>
          </div>
          <Table hover size="sm">
            <thead>
              <tr>
                <td>Nombre</td>
                <td>N&uacute;mero de casas</td>
                <td>Activo</td>
              </tr>
            </thead>
            <tbody>{obrasEl}</tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={show} onHide={handleModalClick}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Obra {selectedObra.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup size="sm">
              <InputGroup.Text id="nombre">Nombre</InputGroup.Text>
              <Form.Control
                placeholder="nombre de obra"
                arialabel="nombre"
                ariadescribedby="nombre"
                name="nombre"
                value={selectedObra.nombre}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text id="casas">Casas</InputGroup.Text>
              <Form.Control
                placeholder="número de casas"
                arialabel="casas"
                ariadescribedby="casas"
                name="casas"
                value={selectedObra.casas}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text id="activo" className="me-2">
                Activo
              </InputGroup.Text>
              <Form.Check
                id="activo"
                name="activo"
                type="switch"
                checked={selectedObra.activo}
                onChange={handleChange}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClick}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalClick} type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Obra;
