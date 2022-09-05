import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

function Usuarios() {
  const token = useSelector((state) => state.token.value);
  const [usuarios, setUsuarios] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [refresh, setRefresh] = useState(true);

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const server = process.env.REACT_APP_API_SERVER;
  const url = `${server}/api/users`;

  useEffect(() => {
    axios.get(url, config).then((result) => {
      setUsuarios(result.data.data);
    });
  }, [url, config, refresh]);

  function handleCrear(event) {
    event.preventDefault();
    setSelectedUser({});
    handleHide();
  }

  function handleChange(event) {
    const { name, value } = event.target;
    let updatedValue = value;

    if (name === "nombre") {
      updatedValue = value.toUpperCase();
    }

    setSelectedUser((prev) => ({ ...prev, [name]: updatedValue }));
  }

  function handleHide() {
    setShow((prev) => !prev);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedUser.uuid) {
      // update user
      axios
        .put(`${url}/${selectedUser.uuid}`, selectedUser, config)
        .finally(() => {
          setRefresh((prev) => !prev);
          handleHide();
        });
    } else {
      // create user
      axios.post(url, selectedUser, config).finally(() => {
        setRefresh((prev) => !prev);
        handleHide();
      });
    }
  }

  function handleClick(uuidStr) {
    axios
      .get(`${url}/${uuidStr}`, config)
      .then((result) => {
        setSelectedUser(result.data);
      })
      .finally(() => {
        handleHide();
      });
  }

  const usuariosEl = usuarios.map((usuario) => {
    return (
      <tr key={usuario.uuid} onClick={() => handleClick(usuario.uuid)}>
        <td>{usuario.username}</td>
        <td>{usuario.nombre}</td>
      </tr>
    );
  });

  const passwordFieldEl = selectedUser.uuid ? (
    ""
  ) : (
    <InputGroup size="sm">
      <InputGroup.Text>Contrase&ntilde;a</InputGroup.Text>
      <Form.Control
        type="password"
        placeholder="Contraseña"
        arialabel="password"
        ariadescribedby="password"
        name="password"
        onChange={handleChange}
        value={selectedUser.password}
      />
    </InputGroup>
  );

  return (
    <>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Usuarios</h3>
          <div className="topRow">
            <div></div>
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
                <td>Usuario</td>
                <td>Nombre</td>
              </tr>
            </thead>
            <tbody>{usuariosEl}</tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={show} onHide={handleHide}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="modalTitle">{`Usuario`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup size="sm">
              <InputGroup.Text>Usuario</InputGroup.Text>
              <Form.Control
                placeholder="Usuario"
                arialabel="username"
                ariadescribedby="username"
                name="username"
                onChange={handleChange}
                value={selectedUser.username}
              />
            </InputGroup>
            <InputGroup size="sm">
              <InputGroup.Text>Nombre</InputGroup.Text>
              <Form.Control
                placeholder="Nombre"
                arialabel="nombre"
                ariadescribedby="nombre"
                name="nombre"
                onChange={handleChange}
                value={selectedUser.nombre}
              />
            </InputGroup>
            {passwordFieldEl}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleHide}>
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

export default Usuarios;
