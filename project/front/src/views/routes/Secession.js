import React, { useState } from "react";
import { customAxios } from "../../config/customAxios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Button, Form } from "react-bootstrap";
import AccountPrivacyModal from "../components/AccountPrivacyModal";
import cssList from "../css/List.module.css";
import cssSecession from "../css/Secession.module.css";

const Secession = () => {
  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onClickConfirmButton = async (event) => {
    event.preventDefault();
    await customAxios
      .delete("/account", {
        data: {
          password,
        },
      })
      .then((response) => {
        if (response.data.message === "비밀번호가 일치하지 않음") {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          alert("회원 탈퇴 되었습니다. 다음에 다시 만나요! 👋");
          localStorage.removeItem("JWT");
          navigate("/");
        }
      })
      .catch((e) => e.message);
  };
  return (
    <>
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
              <Nav.Item className={cssList.unSelected}>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setModal(true);
                  }}
                >
                  회원정보 관리
                </a>
              </Nav.Item>
              <Nav.Item className={cssList.selected}>
                <a>회원탈퇴</a>
              </Nav.Item>
              <AccountPrivacyModal
                show={modal}
                onHide={() => {
                  setModal(false);
                }}
              />
            </Nav>
          </Col>
          <Col>
            <div className={cssSecession.alignCenter}>
              <h2>정말 회원탈퇴 하시겠어요? 😥</h2>
              <h5>탈퇴를 원하시면 비밀번호를 입력해 주세요.</h5>
              <div className={cssSecession.form}>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="******"
                  onChange={onPasswordHandler}
                />
                <Button
                  variant="dark"
                  onClick={(event) => {
                    onClickConfirmButton(event);
                  }}
                >
                  탈퇴
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Secession;
