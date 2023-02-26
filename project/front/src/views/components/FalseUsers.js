import React, { useState, useEffect } from "react";

import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import cssAdmin from "../css/Admin.module.css";
import cssCart from "../css/Cart.module.css";
import { customAxios } from "../../config/customAxios";

export const FalseUsers = (props) => {
  const [usersFalse, setUsersFalse] = useState([]);

  async function getData() {
    return await customAxios.get("admin/users").then((res) => {
      const FalseUser = res.data.filter((user) => user.activate === false);
      setUsersFalse(FalseUser);
    });
  }

  useEffect(() => {
    getData();
  }, [props.isSelected]);

  const UserDelete = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDataDelete = async (e) => {
      await customAxios
        .delete(`admin/falseUsers/${props.userId}`)
        .catch((err) => console.log(err));
      handleClose();
      getData();
    };

    return (
      <>
        <Button variant="secondary" onClick={handleShow}>
          회원삭제
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>회원삭제</Modal.Title>
          </Modal.Header>
          <Modal.Body>회원DB를 삭제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              아니요
            </Button>
            <Button variant="primary" onClick={handleDataDelete}>
              예
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Container className="subContainer">
        <Container>
          <Row className={cssAdmin.infoBox}>
            <Col>
              <p>총 비회원 계정 수</p>
              <h3>{usersFalse.length}</h3>
            </Col>
          </Row>
        </Container>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>비활성화 일자</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {!usersFalse.length ? (
                  <tr>
                    <td colSpan={6} className={cssCart.emptyCart}>
                      <h4>🤔 비활성화 회원 내역이 존재하지 않습니다.</h4>
                    </td>
                  </tr>
                ) : (
                  usersFalse.map((userfalse, index) => {
                    return (
                      <tr key={index}>
                        <td>{userfalse.updatedAt.slice(0, 10)}</td>
                        <td className={cssAdmin.tdAlignLeft}>
                          {userfalse.email}
                        </td>
                        <td>{userfalse.userName}</td>
                        <td>
                          <UserDelete userId={userfalse._id} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};
