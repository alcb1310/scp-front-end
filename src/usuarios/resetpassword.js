import axios from "axios";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

function ResetPassword() {
  const token = useSelector((state) => state.token.value);
  const [user, setUser] = useState({});
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
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios.get(`${url}/user/${user.username}`, config).then(result => {
        console.log(result)
        const uuidStr = result.data.uuid
        axios.put(`${url}/password/${uuidStr}`, user, config).then(result => {
            console.log(result);
        })
    }).catch(error => {
        console.log(error);
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Resetear Contrase&ntilde;a</h3>
          <div className="topRow">
            <div></div>
            <div>
              <Button variant="outline-primary" type="submit">
                Actualizar Contrase&ntilde;a
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <InputGroup>
            <InputGroup.Text>Usuario</InputGroup.Text>
            <Form.Control
              name="username"
              onChange={handleChange}
              value={user.username}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Contrase&ntilde;a</InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </InputGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default ResetPassword;
