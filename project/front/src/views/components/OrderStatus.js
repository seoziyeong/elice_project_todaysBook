import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import cssAccount from "../css/Account.module.css";
import cssCart from "../css/Cart.module.css";
import { customAxios } from "../../config/customAxios";
import { OrderProduct } from "./OrderProduct";

export const OrderStatus = (props) => {
  const [orders, setOrders] = useState([]);

  async function getData() {
    return await customAxios.get("/account/order").then((res) => {
      if (res.data.message === "사용자의 주문 내역이 없습니다") {
        setOrders([]);
        return;
      }
      const statusOrders = res.data.filter(
        (order) => order.status === "배송준비"
      );

      setOrders(statusOrders);
    });
  }
  useEffect(() => {
    getData();
  }, [props.isSelected]);
  const ModalCancel = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDataDelete = async (e) => {
      await customAxios
        .delete(`/orders/${props.orderId}`)
        .then((res) => {
          handleClose();
          getData();
        })
        .catch((err) => console.log(err));
    };

    return (
      <>
        <Button variant="secondary" onClick={handleShow}>
          주문취소
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>주문취소</Modal.Title>
          </Modal.Header>
          <Modal.Body>주문을 취소하시겠습니까?</Modal.Body>
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
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>상품명</th>
                  <th>주문날짜</th>
                  <th>배송상태</th>
                  <th>가격</th>
                  <th>주문취소</th>
                </tr>
              </thead>
              <tbody>
                {!orders.length ? (
                  <tr>
                    <td colSpan={6} className={cssCart.emptyCart}>
                      <h4>🤔 주문내역이 존재하지 않습니다.</h4>
                    </td>
                  </tr>
                ) : (
                  orders.map((orders, index) => {
                    return (
                      <tr key={index}>
                        <td>{orders.orderNumber}</td>
                        <td className={cssAccount.tdAlignLeft}>
                          {OrderProduct(orders)}
                        </td>
                        <td>{orders.createdAt.slice(0, 10)}</td>
                        <td>{orders.status}</td>
                        <td>{orders.totalPrice.toLocaleString("en-US")}</td>
                        <td>
                          <ModalCancel orderId={orders._id} orders={orders} />
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
