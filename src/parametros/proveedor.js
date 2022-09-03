import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

import Pagination from "../components/pagination";

function Proveedor() {
  const token = useSelector((state) => state.token.value);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState({});
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const [page, setPage] = useState(1);
  const [pagin, setPagin] = useState({});
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [error, setError] = useState({});

  const url = `${process.env.REACT_APP_API_SERVER}/api/proveedores`;

  useEffect(() => {
    axios
      .get(`${url}?limit=10&page=${page}&search=${search}`, config)
      .then((proveedor) => {
        setProveedores(proveedor.data.data);
        setPagin(proveedor.data.pagination);
      });
  }, [token, config, url, page, search, refresh]);

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  function handleCrear(e) {
    e.preventDefault();
    setSelectedProveedor({});
    handleModalClick();
  }

  function handleModalClick() {
    setError({})
    setShow((prev) => !prev);
  }

  function handleClick(uuidStr) {
    axios.get(`${url}/${uuidStr}`, config).then((proveedor) => {
      setSelectedProveedor(proveedor.data);
      handleModalClick();
    });
  }

  function handleSearchChange(event) {
    setSearch(event.target.value.toUpperCase());
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setSelectedProveedor((prev) => {
      return {
        ...prev,
        [name]: name === "email" ? value : value.toUpperCase(),
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedProveedor.uuid) {
      axios
        .put(`${url}/${selectedProveedor.uuid}`, selectedProveedor, config)
        .then(() => {
          setRefresh((prev) => !prev);
          handleModalClick();
        })
        .catch((error) => {
          const errorData = error.response.data.detail;
          const errorArray = errorData.split(", ").map((data) => {
            const index = data.indexOf(":");
            const param = data.substr(0, index);
            const value = data.substr(index + 1);
            return { [param]: value };
          });

          let errorObj = {};

          errorArray.forEach((errNo) => {
            if (errNo.ruc) {
              errorObj["ruc"] = errNo.ruc;
            } else if (errNo.nombre) {
              errorObj["nombre"] = errNo.nombre;
            }
          });

          setError(errorObj);
        });
    } else {
      axios
        .post(url, selectedProveedor, config)
        .then(() => {
          setError({});
          setRefresh((prev) => !prev);
          handleModalClick();
        })
        .catch((error) => {
          const errorData = error.response.data.detail;
          const errorArray = errorData.split(", ").map((data) => {
            const index = data.indexOf(":");
            const param = data.substr(0, index);
            const value = data.substr(index + 1);
            return { [param]: value };
          });

          let errorObj = {};

          errorArray.forEach((errNo) => {
            if (errNo.ruc) {
              errorObj["ruc"] = errNo.ruc;
            } else if (errNo.nombre) {
              errorObj["nombre"] = errNo.nombre;
            }
          });

          setError(errorObj);
        });
    }
  }

  const proveedoresEl = proveedores.map((proveedor) => {
    return (
      <tr
        key={proveedor.uuid}
        id={proveedor.id}
        onClick={() => handleClick(proveedor.uuid)}
      >
        <td>{proveedor.ruc}</td>
        <td>{proveedor.nombre}</td>
        <td>{proveedor.contacto}</td>
        <td>{proveedor.telefono}</td>
        <td>{proveedor.email}</td>
      </tr>
    );
  });

  const modalTitle = selectedProveedor.nombre
    ? `: ${selectedProveedor.nombre}`
    : "";

  return (
    <>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Proveedor</h3>
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
                <td>RUC</td>
                <td>Nombre</td>
                <td>Contacto</td>
                <td>Telefono</td>
                <td>Email</td>
              </tr>
            </thead>
            <tbody>{proveedoresEl}</tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
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
            <InputGroup>
              <InputGroup.Text>RUC</InputGroup.Text>
              <Form.Control
                placeholder="RUC"
                arialabel="ruc"
                ariadescribedby="ruc"
                name="ruc"
                value={selectedProveedor.ruc}
                onChange={handleChange}
              />
            </InputGroup>
            {error.ruc ? <p className="danger">{error.ruc}</p> : null}
            <InputGroup>
              <InputGroup.Text>Nombre</InputGroup.Text>
              <Form.Control
                placeholder="Nombre"
                arialabel="nombre"
                ariadescribedby="nombre"
                name="nombre"
                value={selectedProveedor.nombre}
                onChange={handleChange}
              />
            </InputGroup>
            {error.nombre ? <p className="danger">{error.nombre}</p> : null}
            <InputGroup>
              <InputGroup.Text>Contacto</InputGroup.Text>
              <Form.Control
                placeholder="Contacto"
                arialabel="contacto"
                ariadescribedby="contacto"
                name="contacto"
                value={
                  selectedProveedor.contacto ? selectedProveedor.contacto : ""
                }
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>Tel&eacute;fono</InputGroup.Text>
              <Form.Control
                placeholder="Telefono"
                arialabel="telefono"
                ariadescribedby="telefono"
                name="telefono"
                value={
                  selectedProveedor.telefono ? selectedProveedor.telefono : ""
                }
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>E-mail</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="E-mail"
                arialabel="email"
                ariadescribedby="email"
                name="email"
                value={selectedProveedor.email ? selectedProveedor.email : ""}
                onChange={handleChange}
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

export default Proveedor;
