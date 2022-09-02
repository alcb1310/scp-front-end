import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Col, Row, Form, InputGroup, Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

function Actual() {
  const token = useSelector((state) => state.token.value);
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState({});

  const server = process.env.REACT_APP_API_SERVER;
  const url = `${server}/api/presupuestos`;

  useEffect(() => {
    axios
      .get(`${server}/api/obras?activo=true`, config)
      .then((result) => setObras(result.data));
  }, [server, config]);

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .get(`${url}?obra=${selectedObra.uuid}`, config)
      .then((result) => setPresupuestos(result.data.data));
  }

  function handleChange(event) {
    const { value } = event.target;
    axios
      .get(`${server}/api/obras/${value}`, config)
      .then((result) => setSelectedObra(result.data));
  }

  const obrasEl = obras.map((obra) => {
    return (
      <option key={obra.uuid} id={obra.id} value={obra.uuid}>
        {obra.nombre}
      </option>
    );
  });

  function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

  const presupuestosEl = presupuestos.map(presupuesto => {
    return (
        <tr key={presupuesto.uuid}>
            <td>{presupuesto.partida.codigo}</td>
            <td>{presupuesto.partida.nombre}</td>
            <td align="right">{presupuesto.cantini ? numberWithCommas(presupuesto.cantini.toFixed(2)) : ""}</td>
            <td align="right">{presupuesto.costoini ? numberWithCommas(presupuesto.costoini.toFixed(2)) : ""}</td>
            <td align="right">{presupuesto.totalini ? numberWithCommas(presupuesto.totalini.toFixed(2)) : ""}</td>
            <td align="right">{presupuesto.rendidocant !== null  ? numberWithCommas(presupuesto.rendidocant.toFixed(2)) : ""}</td>
            <td align="right">{numberWithCommas(presupuesto.rendidotot.toFixed(2))}</td>
            <td align="right">{presupuesto.porgascan ? numberWithCommas(presupuesto.porgascan.toFixed(2)) : ""}</td>
            <td align="right">{presupuesto.porgascost ? numberWithCommas(presupuesto.porgascost.toFixed(2)) : ""}</td>
            <td align="right">{numberWithCommas(presupuesto.porgastot.toFixed(2))}</td>
            <td align="right">{numberWithCommas(presupuesto.presactu.toFixed(2))}</td>
        </tr>
    )
  })

  return (
    <>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <h3 className="pageTitle">Control Actual</h3>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <InputGroup>
              <InputGroup.Text>Obra</InputGroup.Text>
              <Form.Select onChange={handleChange}>
                <option value="">--- Seleccione una Obra ---</option>
                {obrasEl}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 10, offset: 1 }} className="bottomNavigation">
            <Button
              variant="primary"
              type="submit"
              disabled={selectedObra.uuid ? false : true}
            >
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
            <Table hover size="sm">
                <thead>
                    <tr>
                        <td colSpan={2}>Partida</td>
                        <td colSpan={3}>Inicial</td>
                        <td colSpan={2}>Rendido</td>
                        <td colSpan={3}>Por Gastar</td>
                        <td rowSpan={2}>Actualizado</td>
                    </tr>
                    <tr>
                        <td>C&oacute;digo</td>
                        <td>Nombre</td>
                        <td>Cantidad</td>
                        <td>Unitario</td>
                        <td>Total</td>
                        <td>Cantidad</td>
                        <td>Total</td>
                        <td>Cantidad</td>
                        <td>Unitario</td>
                        <td>Total</td>
                    </tr>
                </thead>
                <tbody>{presupuestosEl}</tbody>
            </Table>
        </Col>
      </Row>
    </>
  );
}

export default Actual;
