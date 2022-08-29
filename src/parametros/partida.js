import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import Pagination from "../components/pagination";

function Partida() {
  const token = useSelector((state) => state.token.value);
  const [partidas, setPartidas] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [search, setSearch] = useState("")
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const [show, setShow] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState({});
  const [parentPartidas, setParentPartidas] = useState([]);
  const [page, setPage] = useState(1);
  const [pagin, setPagin] = useState({});

  const url = process.env.REACT_APP_API_SERVER;

  useEffect(() => {
    axios
      .get(`${url}/api/partidas?limit=10&page=${page}&search=${search}`, config)
      .then((data) => {
        setPartidas(data.data.data);
        setPagin(data.data.pagination);
      });
    axios
      .get(`${url}/api/partidas?acumula=true&sortby=nombre`, config)
      .then((data) => setParentPartidas(data.data.data));
  }, [refresh, config, url, page, search]);

  function handleCrear(e) {
    e.preventDefault();
    setSelectedPartida({});
    handleModalClick();
  }

  function handleClick(id) {
    axios.get(`${url}/api/partidas/${id}`, config).then((data) => {
      setSelectedPartida(data.data);
      handleModalClick();
    });
  }

  function handleModalClick() {
    setShow((prev) => !prev);
  }

  function changePage(pageNumber){
    console.log(`changing to ${pageNumber}`);
    setPage(pageNumber)
  }

  function handleChange(event) {
    const { value, name, type, checked } = event.target;
    setSelectedPartida((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "nivel" || name === "padre_id"
          ? parseInt(value)
          : value.toUpperCase(),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedPartida.uuid) {
      console.log(selectedPartida);
      axios
        .put(
          `${url}/api/partidas/${selectedPartida.uuid}`,
          selectedPartida,
          config
        )
        .then((data) => console.log(data))
        .finally(() => {
          setRefresh((prev) => !prev);
          setShow((prev) => !prev);
        });
    } else {
      axios
        .post(`${url}/api/partidas`, selectedPartida, config)
        .then((data) => console.log(data))
        .finally(() => {
          setRefresh((prev) => !prev);
          setShow((prev) => !prev);
        });
    }
    setRefresh((prev) => !prev);
  }

  const partidasEl = partidas.map((partida) => {
    return (
      <tr
        key={partida.id}
        id={partida.id}
        onClick={() => handleClick(partida.id)}
      >
        <td>{partida.codigo}</td>
        <td>{partida.nombre}</td>
        <td align="center">{partida.nivel}</td>
        <td align="center">
          <FontAwesomeIcon icon={partida.acumula ? faCheck : faXmark} />
        </td>
        <td>{partida.padre ? partida.padre.codigo : ""}</td>
      </tr>
    );
  });

  const modalTitle = selectedPartida.nombre
    ? `: ${selectedPartida.nombre}`
    : "";

  const parentPartidasEl = parentPartidas.map((partida) => {
    return (
      <option key={partida.uuid} value={partida.id}>
        {partida.nombre}
      </option>
    );
  });

  function handleSearchChange(event) {
    setSearch(event.target.value.toUpperCase())
  }

  return (
    <>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Partida</h3>
          <div className="topRow">
            <div>
              <Pagination data={pagin} change={changePage} />
            </div>
            <div>
              <Form>
                <Form.Control
                  placeholder="Búsqueda"
                  value={search}
                  onChange={handleSearchChange}
                />
              </Form>
            </div>
            <div>
              <Button variant="outline-primary" onClick={handleCrear} size="md">
                Crear
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Table hover size="sm">
            <thead>
              <tr>
                <td align="center">C&oacute;digo</td>
                <td align="center">Nombre</td>
                <td align="center">Nivel</td>
                <td align="center">Acumula</td>
                <td align="center">Padre</td>
              </tr>
            </thead>
            <tbody>{partidasEl}</tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={{span:8, offset:2}}>
          <div className="bottomNavigation">
            <Pagination data={pagin} change={changePage} />
          </div>
        </Col>
      </Row>
      <Modal show={show} onHide={handleModalClick}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="modalTitle">{`Partida ${modalTitle}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup size="sm">
              <InputGroup.Text id="codigo">C&oacute;digo</InputGroup.Text>
              <Form.Control
                placeholder="Código"
                arialabel="codigo"
                ariadescribedby="codigo"
                name="codigo"
                value={selectedPartida.codigo}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text id="nombre">Nombre</InputGroup.Text>
              <Form.Control
                placeholder="Nombre"
                arialabel="nombre"
                ariadescribedby="nombre"
                name="nombre"
                value={selectedPartida.nombre}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text id="nivel">Nivel</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Nivel"
                arialabel="nivel"
                ariadescribedby="nivel"
                name="nivel"
                value={selectedPartida.nivel}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text>Acumula</InputGroup.Text>
              <Form.Check
                id="acumula"
                name="acumula"
                type="switch"
                checked={selectedPartida.acumula}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text>Padre</InputGroup.Text>
              <Form.Select
                value={selectedPartida.padre_id}
                name="padre_id"
                onChange={handleChange}
              >
                <option value="">--- Seleccione una partida ---</option>
                {parentPartidasEl}
              </Form.Select>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClick}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Partida;
