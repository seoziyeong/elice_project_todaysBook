import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import cssAdmin from "../css/Admin.module.css";
import cssCart from "../css/Cart.module.css";
import { customAxios } from "../../config/customAxios";
import { OrderProduct } from "./OrderProduct";

export const AdminOrderEnd = (props) => {
  const [adminOrders, setAdminOrders] = useState([]);

  async function getData() {
    return await customAxios.get("admin/orders").then((res) => {
      const AdminOrders = res.data.filter((order) => order.activate === false);
      setAdminOrders(AdminOrders);
    });
  }

  useEffect(() => {
    getData();
  }, [props.isSelected]);

  const AdminModalDelete = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDataDelete = async (e) => {
      await customAxios
        .delete(`/admin/falseOrders/${props.orderId}`)
        .catch((err) => console.log(err));
      handleClose();
      getData();
    };

    return (
      <>
        <Button variant="secondary" onClick={handleShow}>
          주문삭제
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>주문삭제</Modal.Title>
          </Modal.Header>
          <Modal.Body>주문을 삭제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              아니요
            </Button>
            <Button variant="danger" onClick={handleDataDelete}>
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
            <p>총 주문취소 수</p>
            <h2>{adminOrders.length}</h2>
          </Row>
        </Container>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>상품명/수량</th>
                  <th>주문날짜</th>
                  <th>가격</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {!adminOrders.length ? (
                  <tr>
                    <td colSpan={6} className={cssCart.emptyCart}>
                      <h4>🤔 주문취소내역이 존재하지 않습니다.</h4>
                    </td>
                  </tr>
                ) : (
                  adminOrders.map((adminOrders, index) => {
                    return (
                      <tr key={index}>
                        <td>{adminOrders.orderNumber}</td>
                        <td className={cssAdmin.tdAlignLeft}>
                          {OrderProduct(adminOrders)}
                        </td>
                        <td>{adminOrders.createdAt.slice(0, 10)}</td>

                        <td>
                          {adminOrders.totalPrice.toLocaleString("en-US")}
                        </td>
                        <td>
                          <AdminModalDelete orderId={adminOrders._id} />
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
