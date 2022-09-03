import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Pagination from "../components/pagination";
const { Row, Col, Button } = require("react-bootstrap");

function Factura() {
  const token = useSelector((state) => state.token.value);
  const [pagin, setPagin] = useState([]);
  const [page, setPage] = useState(1);
  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [token]);

  const server = process.env.REACT_APP_API_SERVER;
  const url = `${server}/api/facturas`;

  useEffect(() => {
    axios.get(`${url}?limit=10&page=${page}`, config).then(result => {
        console.log(result)
    })
  }, [url, config, page]);

  function handleCrear() {}
  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  return (
    <>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h3 className="pageTitle">Factura</h3>
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
    </>
  );
}

export default Factura;
