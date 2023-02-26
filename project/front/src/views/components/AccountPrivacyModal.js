import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { customAxios } from "../../config/customAxios";
import { useNavigate } from "react-router-dom";

function AccountPrivacyModal({ show, onHide }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const onClickConfirmButton = async (e) => {
    e.preventDefault();
    await checkUser();
  };

  const checkUser = async () => {
    await customAxios
      .post("/modalCheck", { password })
      .then((response) => {
        if (
          response.data.message === "사용자 입력 패스워드가 일치하지 않습니다"
        ) {
          alert("비밀번호가 일치하지 않습니다.");
        } else {
          alert("비밀번호가 일치합니다.");

          navigate("/account/privacy");
        }
      })
      .catch((e) => e.message);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleKeyPress = async (e) => {
    if (e.keyCode === 13) {
      await checkUser();
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => handleSubmit(event)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>본인확인을 위해 비밀번호를 입력해 주세요.</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                autoFocus
                value={password}
                onChange={handlePassword}
                onKeyDown={handleKeyPress}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            취소
          </Button>
          <Button
            onClick={(e) => {
              onClickConfirmButton(e);
            }}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AccountPrivacyModal;
