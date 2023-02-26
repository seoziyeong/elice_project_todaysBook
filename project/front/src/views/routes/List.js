import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { ShowItemList } from "../components/ShowItemList"; // 상품 list components
import { customAxios } from "../../config/customAxios";
import cssList from "../css/List.module.css";

const List = () => {
  const [categoryLists, setCategoryLists] = useState([]); // 전체 탭
  const [category, setCategory] = useState(""); // 선택 탭
  const [products, setProducts] = useState([]);

  async function getData() {
    return await customAxios
      .get("/products")
      .then((res) => {
        // 데이터에서 카테고리만 빼서 list에 push
        let list = [];
        res.data.map((v, i) => {
          if (v.categoryName !== "None-category") {
            list.push(v.categoryName);
          }
        });

        list = [...new Set(list)]; // 중복 제거
        setCategoryLists(list);
        setCategory(list[0]);

        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Container className="subContainer">
        <Row>
          <Col xs lg="2">
            <Nav className="flex-column">
              {categoryLists.map((v, i) => {
                if (v == category) {
                  return (
                    <Nav.Item key={i} className={cssList.selected}>
                      <a
                        onClick={() => {
                          setCategory(v);
                        }}
                      >
                        {v}
                      </a>
                    </Nav.Item>
                  );
                }
                return (
                  <Nav.Item key={i} className={cssList.unSelected}>
                    <a
                      onClick={() => {
                        setCategory(v);
                      }}
                    >
                      {v}
                    </a>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Col>
          <Col>
            <h2 className={cssList.pageTitle}>{category}</h2>
            <ShowItemList
              data={products.filter((f) => f.categoryName == category)}
            />
          </Col>
        </Row>
      </Container>
      <Container></Container>
    </>
  );
};

export default List;
