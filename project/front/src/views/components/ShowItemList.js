import React, { useEffect, useState } from "react";
import { Card, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cssItemList from "../css/ShowItemList.module.css";

export const ShowItemList = ({ data }) => {
  const navigate = useNavigate();

  const [refreshData, setRefreshData] = useState([]);
  useEffect(() => {
    setRefreshData(data.filter((f) => f.activate == true));
  }, [data]);

  return (
    <Container>
      <Row className={cssItemList.row}>
        {refreshData.map((product, i) => {
          return (
            <Card key={i} className={cssItemList.card}>
              <div
                className={cssItemList.productThumbnail}
                onClick={() => {
                  navigate(`/products/${product._id}`);
                }}
              >
                <img src={product.img} />
              </div>
              <Card.Body>
                <div className={cssItemList.textArea}>
                  <Card.Title
                    onClick={() => {
                      navigate(`/products/${product._id}`);
                    }}
                  >
                    {product.productName}
                  </Card.Title>
                  <Card.Text>
                    {product.price.toLocaleString("en-US")} 원
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};
