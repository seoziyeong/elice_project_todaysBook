const express = require("express");
const router = express.Router();
const { Order, User } = require("../models/index");
const verifyUser = require("../middleware/verifyUser_middlewaring");

// ------ USER: 현재 유저의 주문내역 조회 ------
router.get("/", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 사용자 주문 내역 조회 시도 ---------------------"
  );
  try {
    // 현재 유저 불러오기

    const verifiedUser_id = req.verifiedUser_id;

    const orders = await Order.find({
      userId: verifiedUser_id,
      activate: true,
    }); // 현재 유저의 주문내역 찾기

    if (!orders[0]) {
      console.error("사용자의 주문 내역이 없습니다.");
      console.log(
        "---------------- 사용자 주문 조회 실패 ---------------------"
      );
      throw new Error("현재 사용자의 주문내역이 없습니다.");
    } else {
      const user = await User.findOne({ _id: verifiedUser_id });
      console.log(user.userName, "님의 주문 내역 : ", orders);
    }

    console.log(
      "---------------- 사용자 주문 내역 조회 성공 ---------------------"
    );
    res.status(200).json(orders);
  } catch (e) {
    next(e);
  }
});

// ------ USER: 현재 유저의 주문내역 생성 ------
router.post("/", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 사용자 주문 데이터 생성 시도 ---------------------"
  );
  try {
    // 현재 유저 불러오기
    const verifiedUser_id = req.verifiedUser_id;

    // req.body: address(postalCode, address1, address2, recieverName, recieverPhone),
    // orderNumber, comment, status, orderList(productName, count),
    // totalProductPrice, shipping, totalPrice

    const orders = req.body;
    console.log("주문 요청 데이터", orders);
    if (Object.keys(orders).length == 0) {
      console.error("req.body 없음");
      console.log(
        "---------------- 요청 데이터 Body 확인 실패 -------------------"
      );
      throw new Error("req.body 내용이 없습니다.");
    }

    // userId는 직접 추가
    // User의 userId와 혼동이 올 수 있음 (쥬문의 userId에는 User의 _id 값이 들어가기 때문 )

    const newOrder = await Order.create({
      ...orders,
      userId: verifiedUser_id,
    });

    // create 자체에서 required된 값들에 대한 에러를 검사한다.

    console.log("생성된 주문 데이터 : ", newOrder);
    console.log(
      "---------------- 사용자 주문 데이터 생성 성공 ---------------------"
    );
    res.status(200).json({ orderNumber: newOrder.orderNumber });
  } catch (e) {
    next(e);
  }
});

// ------ USER: 현재 유저의 주문내역 수정 ------
router.patch("/:_id", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 사용자 주문 내역 수정 시도 ---------------------"
  );
  try {
    // 현재 유저 불러오기
    const verifiedUser_id = req.verifiedUser_id;

    const { _id } = req.params;

    if (_id === ":_id") {
      console.error("req.params 없음");
      console.log(
        "---------------- 요청 데이터 Param 확인 실패 ---------------------"
      );
      throw new Error("req.params가 없습니다.");
    }

    const updateOrder = req.body;
    if (Object.keys(updateOrder).length == 0) {
      console.error("req.body 없음");
      console.log(
        "---------------- 요청 데이터 Body 확인 실패 ---------------------"
      );
      throw new Error("req.body가 없습니다.");
    } else {
      console.log("수정 요청 정보 : ", updateOrder);
    }

    await Order.findOneAndUpdate({ _id, userId: verifiedUser_id }, updateOrder);
    const order = await Order.findOne({ _id, userId: verifiedUser_id });

    console.log(
      "---------------- 사용자 주문 내역 수정 성공 ---------------------"
    );
    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ USER: 현재 유저의 주문내역 삭제 (비활성화) ------
router.delete("/:_id", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 사용자 주문 내역 삭제(비활성화) 시도 ---------------------"
  );
  try {
    // 현재 유저 불러오기
    const verifiedUser_id = req.verifiedUser_id;

    const { _id } = req.params;

    if (_id === ":_id") {
      console.error("req.params 없음");
      console.log(
        "---------------- 요청 데이터 Param 확인 실패 ---------------------"
      );
      throw new Error("req.params가 없습니다.");
    }

    await Order.findOneAndUpdate(
      { _id, userId: verifiedUser_id },
      { activate: false }
    );
    const order = await Order.findOne({ _id, userId: verifiedUser_id });

    if (order.activate == false) {
      console.log("사용자 주문 비활성화 완료 activate : ", order.activate);
    } else {
      console.error("사용자 주문 비활성화 실패");
      console.log(
        "---------------- 사용자 주문 내역 삭제(비활성화) 실패 ---------------------"
      );
      throw new Error("사용자 주문 삭제(비활성화) 실패");
    }

    console.log(
      "---------------- 사용자 주문 내역 삭제(비활성화) 성공 ---------------------"
    );
    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
