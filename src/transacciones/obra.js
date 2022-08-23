import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Button, Table, Row, Col } from "react-bootstrap";

function Obra() {
  const token = useSelector((state) => state.token.value);
  const [obras, setObras] = useState([]);
  const url = process.env.REACT_APP_API_SERVER;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get(`${url}/api/obras`, config).then((data) => setObras(data.data));
  }, [url, token]);

  function handleEditClick(uuid) {
    console.log(uuid);
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
          <FontAwesomeIcon icon={obra.activo ? faCheck :faXmark} />
        </td>
      </tr>
    );
  });

  return (
    <Row>
      <Col md={{ span: 8, offset: 2 }}>
        <h3 className="pageTitle">Obra</h3>
        <div align="right">
          <Button variant="outline-primary">Crear</Button>
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
  );
}

export default Obra;
