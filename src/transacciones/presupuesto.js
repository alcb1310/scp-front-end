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

import Pagination from "../components/pagination";

function Presupuesto() {
  const token = useSelector((state) => state.token.value);
  const [refresh, setRefresh] = useState(true);
  const [search, setSearch] = useState("");
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [pagin, setPagin] = useState({});
  const [presupuestos, setPresupuestos] = useState([]);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState({});
  const [obras, setObras] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [error, setError] = useState({});

  const server = process.env.REACT_APP_API_SERVER;
  const url = `${server}/api/presupuestos`;

  useEffect(() => {
    axios.get(`${url}?acumula=false&limit=10&page=${page}`, config).then((data) => {
      setPresupuestos(data.data.data);
      setPagin(data.data.pagination);
    });
  }, [refresh, search, page, url, token, config]);

  useEffect(() => {
    // Promise.all(
    axios.get(`${server}/api/obras?activo=true`, config).then((data) => {
      setObras(data.data);
    });
    axios
      .get(`${server}/api/partidas?acumula=false&sortby=nombre`, config)
      .then((data) => {
        setPartidas(data.data.data);
      });
  }, [config, server]);

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  function handleSearchChange(event) {
    const { value } = event.target;
    setSearch(value);
  }

  function handleClick(uuidStr) {
    axios
      .get(`${url}/${uuidStr}`, config)
      .then((data) => setSelectedPresupuesto(data.data));
    handleModalClick();
  }

  function handleModalClick() {
    setShow((prev) => !prev);
  }

  function handleCrear() {
    setSelectedPresupuesto({});
    handleModalClick();
  }

  function handleChange(event) {
    const { name, value } = event.target;
    let total = 0;
    if (name === "porgascan") {
      if (isNaN(value)) {
        setError((prev) => ({
          ...prev,
          porgascan: "Ingrese un valor numérico",
        }));
        return;
      } else {
        setError((prev) => {
          delete prev.porgascan;
          return prev;
        });
        total = selectedPresupuesto.porgascost * value;
      }
    }

    if (name === "porgascost") {
      if (isNaN(value)) {
        setError((prev) => ({
          ...prev,
          porgascost: "Ingrese un valor numérico",
        }));
        return;
      } else {
        setError((prev) => {
          delete prev.porgascost;
          return prev;
        });
        total = selectedPresupuesto.porgascan * value;
      }
    }

    setSelectedPresupuesto((prev) => ({
      ...prev,
      [name]: value,
      porgastot: total,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const presupuestoToSave = {
      obra_id: selectedPresupuesto.obra_id,
      partida_id: selectedPresupuesto.partida_id,
      cantidad: selectedPresupuesto.porgascan,
      unitario: selectedPresupuesto.porgascost,
    };

    if (selectedPresupuesto.uuid) {
      // updating
      axios
        .put(`${url}/${selectedPresupuesto.uuid}`, presupuestoToSave, config)
        // .then((data) => console.log(data))
        .finally(() => {
          setRefresh((prev) => !prev);
          handleModalClick();
        });
    } else {
      // creating
      axios
        .post(url, presupuestoToSave, config)
        // .then((data) => console.log(data))
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setRefresh((prev) => !prev);
          handleModalClick();
        });
    }
  }

  const obrasEl = obras.map((obra) => {
    return (
      <option key={obra.uuid} value={obra.id}>
        {obra.nombre}
      </option>
    );
  });

  const partidasEl = partidas.map((partida) => {
    return (
      <option key={partida.uuid} value={partida.id}>
        {partida.nombre}
      </option>
    );
  });

  const presupuestosEl = presupuestos.map((presupuesto) => {
    return (
      <tr
        key={presupuesto.uuid}
        className="smallText"
        onClick={() => handleClick(presupuesto.uuid)}
      >
        <td>{presupuesto.obra.nombre}</td>
        <td>{presupuesto.partida.codigo}</td>
        <td>{presupuesto.partida.nombre}</td>
        <td align="right">
          {presupuesto.porgascan ? presupuesto.porgascan.toFixed(2) : ""}
        </td>
        <td align="right">
          {presupuesto.porgascost ? presupuesto.porgascost.toFixed(2) : ""}
        </td>
        <td align="right">
          {presupuesto.porgastot ? presupuesto.porgastot.toFixed(2) : ""}
        </td>
        <td align="right">
          {presupuesto.presactu ? presupuesto.presactu.toFixed(2) : ""}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h3 className="pageTitle">Presupuesto</h3>
          <div className="topRow">
            <div>
              <Pagination data={pagin} change={changePage} />
            </div>
            {/* <div>
              <Form>
                <Form.Control
                  placeholder="Búsqueda"
                  value={search}
                  onChange={handleSearchChange}
                />
              </Form>
            </div> */}
            <div>
              <Button variant="outline-primary" onClick={handleCrear} size="md">
                Crear
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <Table hover size="sm">
            <thead>
              <tr>
                <td rowSpan={2} align="center">
                  Obra
                </td>
                <td colSpan={2} align="center">
                  Partida
                </td>
                <td colSpan={3} align="center">
                  Por Gastar
                </td>
                <td rowSpan={2} align="center">
                  Actualizado
                </td>
              </tr>
              <tr>
                <td align="center">C&oacute;digo</td>
                <td align="center">Nombre</td>
                <td align="center">Cantidad</td>
                <td align="center">Unitario</td>
                <td align="center">Total</td>
              </tr>
            </thead>
            <tbody>{presupuestosEl}</tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={{span:10, offset:1}}>
          <div className="bottomNavigation">
            <Pagination data={pagin} change={changePage} />
          </div>
        </Col>
      </Row>
      <Modal show={show}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header>Presupuesto</Modal.Header>
          <Modal.Body>
            <InputGroup>
              <InputGroup.Text>Obra</InputGroup.Text>
              <Form.Select
                value={selectedPresupuesto.obra_id}
                name="obra_id"
                onChange={handleChange}
              >
                <option value="">--- Seleccione una Obra ---</option>
                {obrasEl}
              </Form.Select>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Partida</InputGroup.Text>
              <Form.Select
                value={selectedPresupuesto.partida_id}
                name="partida_id"
                onChange={handleChange}
              >
                <option value="">--- Seleccione una Partida ---</option>
                {partidasEl}
              </Form.Select>
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Cantidad</InputGroup.Text>
              <Form.Control
                name="porgascan"
                value={selectedPresupuesto.porgascan}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Unitario</InputGroup.Text>
              <Form.Control
                name="porgascost"
                value={selectedPresupuesto.porgascost}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Total</InputGroup.Text>
              <Form.Control
                name="porgastot"
                value={selectedPresupuesto.porgastot}
                disabled
              />
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

export default Presupuesto;
