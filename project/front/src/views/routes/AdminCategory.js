import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Nav,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import cssItemList from "../css/ShowItemList.module.css";
import { customAxios } from "../../config/customAxios";
import uuid from "react-uuid";
import cssList from "../css/List.module.css";
import cssAdminCateg from "../css/AdminCategory.module.css";

const AdminCategory = () => {
  const navigate = useNavigate();

  const [categoryLists, setCategoryLists] = useState([]); // 전체 카테고리
  const [category, setCategory] = useState(""); // 카테고리
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  async function getData() {
    return await customAxios
      .get("/products")
      .then((res) => {
        // 데이터에서 카테고리만 빼서 list에 push
        let data = res.data.filter((f) => f.activate);
        let list = [];
        data.map((v, i) => {
          list.push(v.categoryName);
        });
        list.sort();
        list = ["전체", ...new Set(list)]; // 중복 제거
        setCategoryLists(list);
        setCategory(sessionStorage.getItem("currentCategory") || list[0]);

        setProducts(data);
        setSelectedProducts(data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getData();
  }, []);

  // 선택 카테고리 상품 보여주기
  function showSelectedProducts() {
    if (category == "전체") {
      setSelectedProducts(products);
    } else {
      setSelectedProducts(products.filter((f) => f.categoryName == category));
    }
  }

  useEffect(() => {
    showSelectedProducts();
  }, [category, products]);

  async function deleteProduct(product) {
    await customAxios
      .delete(`/admin/products/${product._id}`)
      .then((res) => {
        let data = res.data;
        // 카테고리 - selectbox에 상태 유지
        if (
          data.filter(
            (f) => f.categoryName == product.categoryName && f.activate == true
          ).length > 0
        ) {
          sessionStorage.setItem("currentCategory", product.categoryName);
        } else {
          let newList = [...categoryLists];
          newList.splice(
            newList.indexOf(
              sessionStorage.getItem("currentCategory") || product.categoryName
            ),
            1
          );
          sessionStorage.removeItem("currentCategory");
          setCategory("전체");
          setCategoryLists(newList);
        }

        // 상품 리스트 리렌더링
        let filteredData = res.data.filter((f) => f.activate);
        setProducts(filteredData);
        if (sessionStorage.getItem("currentCategory")) {
          filteredData = data.filter(
            (f) => f.categoryName == sessionStorage.getItem("currentCategory")
          );
          setSelectedProducts(filteredData);
        }
        setSelectedProducts(filteredData);

        alert("상품이 삭제 되었습니다.");
      })
      .catch((err) => console.log(err));
  }

  // 카테고리 삭제 Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function deleteCategory() {
    return await customAxios
      .delete("admin/category", {
        data: {
          categoryName: category,
        },
      })
      .then((res) => {
        if (
          sessionStorage.getItem("currentCategory") &&
          sessionStorage.getItem("currentCategory") == category
        ) {
          sessionStorage.removeItem("currentCategory");
        }

        let newList = [...categoryLists];
        newList.splice(newList.indexOf(category), 1);

        let newProduct = [...products].filter(
          (f) => f.categoryName != category
        );
        let deletedProduct = [...products].filter(
          (f) => f.categoryName == category
        );
        deletedProduct.map((v, i) => (v.categoryName = "None-category"));
        setCategoryLists(newList);
        setProducts([...newProduct, ...deletedProduct]);
        setCategory("전체");
        handleClose();
      })
      .catch((err) => console.log(err));
  }

  // 페이지 이탈시 카테고리 정보 지움
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("currentCategory");
    };
  }, []);

  return (
    <>
      <Container className="subContainer">
        <Row>
          <Col xs lg="2">
            <Nav className="flex-column">
              <Nav.Item className={cssList.unSelected}>
                <a
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  전체 주문 관리
                </a>
              </Nav.Item>
              <Nav.Item className={cssList.unSelected}>
                <a
                  onClick={() => {
                    navigate("/admin/users");
                  }}
                >
                  전체 회원 관리
                </a>
              </Nav.Item>
              <Nav.Item className={cssList.selected}>
                <a>카테고리/상품 관리</a>
              </Nav.Item>
              <Nav.Item className={cssList.unSelected}>
                <a
                  onClick={() => {
                    navigate("/admin/products");
                  }}
                >
                  상품 등록
                </a>
              </Nav.Item>
            </Nav>
          </Col>
          <Col>
            <h2 className={cssList.pageTitle}>카테고리/상품 관리</h2>
            <div className={cssAdminCateg.selectBox}>
              <Form.Select
                defaultValue={category}
                key={uuid()}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                {categoryLists.map((v, i) => {
                  return (
                    <option value={v} key={i}>
                      {v}
                    </option>
                  );
                })}
              </Form.Select>
              {category != "전체" && category != "None-category" && (
                <Button variant="outline-danger" onClick={handleShow}>
                  삭제
                </Button>
              )}
            </div>
            <Container>
              <Row className={cssItemList.row}>
                {selectedProducts.map((product, i) => {
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
                        <Button
                          variant="outline-secondary"
                          className={cssItemList.btn}
                          onClick={() => {
                            navigate(`products/${product._id}`);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outline-danger"
                          className={cssItemList.btn}
                          onClick={() => {
                            deleteProduct(product);
                          }}
                        >
                          삭제
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
              </Row>
            </Container>
          </Col>
        </Row>

        {/* 카테고리 삭제 Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>카테고리 삭제</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            정말 삭제 하시겠습니까? 상품은 None-category로 이동되며,
            <br />
            카테고리 재설정이 필요합니다.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
            <Button variant="danger" onClick={deleteCategory}>
              카테고리 삭제
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default AdminCategory;
