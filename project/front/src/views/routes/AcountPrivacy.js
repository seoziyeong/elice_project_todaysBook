import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Nav,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { customAxios } from "../../config/customAxios";
import Post from "../components/Post";
import cssList from "../css/List.module.css";
import { Regex } from "../components/Regex";

const AcountPrivacy = () => {
  const navigate = useNavigate();

  const [receiverName, setReceiverName] = useState("");
  const [receiverPassword, setReceiverPassword] = useState("");
  const [receiverConfirmPassword, setReceiverConfirmPassword] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address2, setAddress2] = useState("");
  const [address1, setAddress1] = useState("");

  const [zonecode, setZonecode] = useState("");
  const [modal, setModal] = useState(false);

  const [popup, setPopup] = React.useState(false);
  const [user, setUser] = useState([]);
  async function getData() {
    return await customAxios
      .get("/account")
      .then((res) => {
        setUser(res.data);
        setReceiverName(res.data.userName);
        if (res.data.phone) {
          setReceiverPhone(res.data.phone);
        }
        if (res.data.address) {
          setZonecode(res.data.address.postalCode);
          setAddress1(res.data.address.address1);
          setAddress2(res.data.address.address2);
        } else {
        }
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getData();
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (receiverPassword !== receiverConfirmPassword) {
      return alert("비밀번호가 비밀번호 확인과 일치하지 않습니다.");
    } else if (!Regex(receiverPassword)) {
      return alert("영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.");
    } else if (!receiverPassword.length || !receiverConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인을 입력해주세요.");
    } else {
      return await customAxios
        .post("/account", {
          userName: receiverName,
          password: receiverPassword,
          phone: receiverPhone,
          address: {
            postalCode: zonecode,
            address1: address1,
            address2: address2,
          },
        })
        .then((response) => {
          alert("회원 정보가 저장되었습니다.");
          navigate("/account/orders");
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  return (
    <Container className="subContainer">
      <Row>
        <Col xs lg="2">
          <Nav className="flex-column">
            <Nav.Item className={cssList.unSelected}>
              <a
                onClick={() => {
                  navigate("/account/orders");
                }}
              >
                주문 조회
              </a>
            </Nav.Item>
            <Nav.Item className={cssList.selected}>
              <a>회원정보 관리</a>
            </Nav.Item>
            <Nav.Item className={cssList.unSelected}>
              <a
                onClick={() => {
                  navigate("/account/secession");
                }}
              >
                회원탈퇴
              </a>
            </Nav.Item>
          </Nav>
        </Col>
        <Col>
          <h2 className={cssList.pageTitle}>회원정보 관리</h2>
          <Form style={{ marginLeft: "24px" }}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="username"
                placeholder="이름"
                defaultValue={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                defaultValue={receiverPassword}
                onChange={(e) => setReceiverPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                defaultValue={receiverConfirmPassword}
                onChange={(e) => setReceiverConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>연락처</Form.Label>
              <Form.Control
                type="phone"
                placeholder="연락처 입력"
                defaultValue={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
              />
              <Form.Text className="text-muted">예시) 01012345678</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>주소</Form.Label>
              <InputGroup>
                <Form.Control
                  className="mb-1"
                  placeholder="우편번호"
                  defaultValue={zonecode}
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
                defaultValue={address1}
              />
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="상세주소 입력"
                defaultValue={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </Form.Group>
            <Button
              onClick={(event) => {
                onSubmitHandler(event);
              }}
            >
              저장
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AcountPrivacy;
