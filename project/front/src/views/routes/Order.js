import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { customAxios } from "../../config/customAxios";
import axios from "axios"; // original axios가 필요한 페이지 입니다. 삭제 금지
import cssCart from "../css/Cart.module.css";
import cssOrder from "../css/Order.module.css";
import Post from "../components/Post";

const Cart = () => {
  const navigate = useNavigate();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [selected, setSelected] = useState("");
  const [comment, setComment] = useState(" ");
  const [finalCommentReq, setFinalCommentReq] = useState(""); // 서버에 보낼 comment
  const [popup, setPopup] = React.useState(false); // 주소검색

  const comments = {
    0: "",
    1: "직접 수령하겠습니다.",
    2: "배송 전 연락 바랍니다.",
    3: "부재 시 경비실에 맡겨주세요.",
    4: "부재 시 문 앞에 놓아주세요.",
    5: "부재 시 택배함에 넣어주세요.",
    6: "6",
  };

  // 로컬스토리지 cart 데이터 가공
  let carts = JSON.parse(localStorage.getItem("cart"));

  let cartItemsId = [];
  if (carts) {
    cartItemsId = carts.map((v, i) => v._id);
  }

  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // query parameter로 보내야 하는 URL 가공
  function getRouteURL() {
    let routeURL = "/cartlist?";
    cartItemsId.map((v, i) => {
      routeURL += `_id=${v}&`;
    });
    routeURL = routeURL.slice(0, -1);
    return routeURL;
  }
  // ex ) /cartlist?_id=63dcd6803f53abb02db79241&_id=63e0900cffeb097384da75b3

  // 데이터 통신 : get
  const [products, setProducts] = useState([]);

  async function getData() {
    Promise.all(
      [`${getRouteURL()}`, "/account"].map((url) => customAxios.get(url))
    )
      .then(
        axios.spread((res1, res2) => {
          // res1 : 상품 데이터
          if (res1.data.result !== "fail") {
            const data = res1.data;
            data.map((v, i) => {
              v["count"] = carts.filter((f) => f._id == v._id)[0].count;
            }); // 데이터에 count 데이터 추가

            setProducts(data);
            const tpp = data.reduce((a, b) => {
              return a + b.price * b.count;
            }, 0);
            setTotalProductPrice(tpp);

            const tp = data.reduce((a, b) => {
              return a + b.price * b.count;
            }, 3000);
            setTotalPrice(tp);
          }
          // res2 : 유저 데이터
          if (res2.data.hasOwnProperty("_id")) {
            setReceiverName(res2.data.userName);

            if (res2.data.phone) {
              setReceiverPhone(res2.data.phone);
            }
            if (res2.data.address) {
              setAddress1(res2.data.address.address1);
              setAddress2(res2.data.address.address2);
              setZonecode(res2.data.address.postalCode);
            }
          }
        })
      )
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getData();
  }, []);

  // 주문 요청사항 useEffect 처리
  useEffect(() => {
    if (selected.length > 3) {
      setFinalCommentReq(selected);
    } else if (comment !== null) {
      setFinalCommentReq(comment);
    }
  }, [selected, comment]);

  // 데이터 통신 : post
  const orderList = products.map((v, i) => {
    const obj = {
      productName: v.productName,
      count: v.count,
    };
    return obj;
  });

  // 배송지 입력 검증
  function checkedRules() {
    let checked = true;

    for (let item of [
      receiverName,
      receiverPhone,
      zonecode,
      address1,
      address2,
    ]) {
      if (item == "" || !item) {
        checked = false;
      }
    }
    return checked;
  }

  async function postNewOrder() {
    if (checkedRules()) {
      return await customAxios
        .post("/orders", {
          address: {
            postalCode: zonecode,
            address1: address1,
            address2: address2,
            receiverName: receiverName,
            receiverPhoneNumber: receiverPhone,
          },
          orderList,
          comment: finalCommentReq,
          totalProductPrice: totalProductPrice,
          totalPrice,
        })
        .then((res) => {
          sessionStorage.setItem("orderNumber", res.data.orderNumber);
          navigate("/order/complete");
        })
        .catch((err) => console.log(err));
    } else {
      alert("⚠ 배송지 정보 : 이름, 연락처, 주소를 입력해주세요.");
    }
  }

  function handleChange(e, variable) {
    switch (variable) {
      case "name":
        setReceiverName(e.target.value);
        break;
      case "phone":
        setReceiverPhone(e.target.value);
        break;
      case "zone":
        setZonecode(e.target.value);
        break;
      case "address1":
        setAddress1(e.target.value);
        break;
      case "address2":
        setAddress2(e.target.value);
        break;
    }
  }

  return (
    <Container className="subContainer">
      <div className={cssCart.titleArea}>
        <h2 className="page-title"> 주문결제 </h2>
      </div>
      <Row>
        <Col className={cssOrder.deliveryInfo}>
          <h3> 배송지 정보 </h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label> 이름 </Form.Label>
              <Form.Control
                type="username"
                placeholder="이름"
                value={receiverName}
                readOnly={false}
                onChange={(e) => handleChange(e, "name")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> 연락처 </Form.Label>
              <Form.Control
                type="phone"
                placeholder="연락처 입력"
                value={receiverPhone}
                readOnly={false}
                onChange={(e) => handleChange(e, "phone")}
              />
              <Form.Text className="text-muted"> 예시) 01012345678 </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> 주소 </Form.Label>
              <InputGroup>
                <Form.Control
                  className="mb-1"
                  placeholder="우편번호"
                  value={zonecode}
                  readOnly={false}
                  onChange={(e) => handleChange(e, "zone")}
                />
                <Button
                  className="mb-1"
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={() => {
                    setPopup(!popup);
                  }}
                >
                  검색
                </Button>
                {popup && (
                  <Post
                    address1={address1}
                    setAddress1={setAddress1}
                    zonecode={zonecode}
                    setZonecode={setZonecode}
                  ></Post>
                )}
              </InputGroup>
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="주소"
                value={address1}
                readOnly={false}
                onChange={(e) => handleChange(e, "address1")}
              />
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="상세주소 입력"
                value={address2}
                readOnly={false}
                onChange={(e) => handleChange(e, "address2")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> 요청사항 </Form.Label>
              <Form.Select
                className="mb-1"
                placeholder="배송시 요청사항을 선택해 주세요."
                onChange={(e) => {
                  setSelected(comments[e.target.value]);
                }}
              >
                <option value="0"> 배송시 요청사항을 선택해 주세요. </option>
                <option value="1"> 직접 수령하겠습니다. </option>
                <option value="2"> 배송 전 연락 바랍니다. </option>
                <option value="3"> 부재 시 경비실에 맡겨주세요. </option>
                <option value="4"> 부재 시 문 앞에 놓아주세요. </option>
                <option value="5"> 부재 시 택배함에 넣어주세요. </option>
                <option value="6"> 직접 입력 </option>
              </Form.Select>
              {/* comment 직접 입력 */}
              {selected == "6" && (
                <Form.Control
                  type="text"
                  placeholder="직접 입력"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
              )}
            </Form.Group>
          </Form>
        </Col>
        <Col xs lg="3">
          <Row className={cssCart.orderInfo}>
            <h3> 결제 정보 </h3>
            <div>
              <div className={cssOrder.orderProductsList}>
                <p> 주문 상품 </p>
                <div className={cssCart.orderList}>
                  {products.map((v, i) => {
                    return (
                      <p key={i}>
                        {v.productName} / {v.count} 개
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className={cssCart.info}>
                <p> 총 상품금액 </p>
                <p> {totalProductPrice.toLocaleString("en-US")} 원 </p>
              </div>
              <div className={cssCart.info}>
                <p> 배송비 </p> <p> 3,000 원 </p>
              </div>
            </div>
            <div className={cssCart.result}>
              <p> 총 결제금액 </p>
              <h4> {totalPrice.toLocaleString("en-US")}원 </h4>
            </div>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    postNewOrder();
                  }}
                >
                  결제하기
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
