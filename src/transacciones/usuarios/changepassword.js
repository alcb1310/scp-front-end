import axios from "axios";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";

function ChangePassword() {
  const token = useSelector((state) => state.token.value);
  const [passwords, setPasswords] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState({});

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const server = process.env.REACT_APP_API_SERVER;
  const url = `${server}/api/users`;

  function handleChange(event) {
    const { name, value } = event.target;

    setPasswords((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    if (passwords.newpass !== passwords.repeat) {
        setError("Contraseñas deben ser iguales");
        return;
    }
    
    console.log(passwords.newpass.length);
    if (passwords.newpass.length < 8) {
      setError("Contraseñas deben ser de al menos 8 caracteres");
      return;
    }

    setError("");
    axios.get(`${url}/me`, config).then((result) => {
      const currentUser = result.data;
      const toVerify = {
        username: currentUser.username,
        nombre: currentUser.nombre,
        password: passwords.prevpass,
      };
      
      axios.post(`${url}/password`, toVerify, config).then((verifyResult) => {
        if (verifyResult.data.data) {
          const payload = {
            password: passwords.newpass,
          };
          axios
            .put(`${url}/password/${currentUser.uuid}`, payload, config)
            .then(() => {
              setStatus({
                variant: "success",
                message: "Contraseña actualizada correctamente",
              });
            })
            .catch(() => {
              setStatus({
                variant: "danger",
                message: "Error al actualizar la contraseña",
              });
            });
        } else {
          setStatus({
            variant: "danger",
            message: "Imposible verificar contraseña anterior",
          });
        }
      });
    });
  }

  const alertEl = status.variant ? (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        <Alert variant={status.variant}>{status.message}</Alert>
      </Col>
    </Row>
  ) : (
    ""
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Cambiar Contrase&ntilde;a</h3>
          <div className="topRow">
            <div></div>
            <div>
              <Button variant="outline-primary" type="submit">
                Grabar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      {alertEl}
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <InputGroup>
            <InputGroup.Text>Contrase&ntilde;a Anterior</InputGroup.Text>
            <Form.Control
              type="password"
              name="prevpass"
              onChange={handleChange}
              value={passwords.prevpass}
            />
          </InputGroup>
          <InputGroup className="has-validation">
            <InputGroup.Text>Nueva Contrase&ntilde;a</InputGroup.Text>
            <Form.Control
              type="password"
              name="newpass"
              onChange={handleChange}
              value={passwords.newpass}
              isInvalid={error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Nueva Contrase&ntilde;a</InputGroup.Text>
            <Form.Control
              type="password"
              name="repeat"
              onChange={handleChange}
              value={passwords.repeat}
              isInvalid={error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ChangePassword;
