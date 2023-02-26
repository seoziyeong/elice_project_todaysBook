const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;
const getHash = require("../utils/hash-password");
const verifyUser = require("../middleware/verifyUser_middlewaring");
const { Order } = require("../models/index");
const { User } = require("../models/index");

// 마이페이지 접근시 (주문조회)
router.get("/order", verifyUser(), async (req, res, next) => {
  try {
    console.log(
      "------------------- 마이페이지(주문조회) 접근 ------------------------"
    );
    const verifiedUser_id = req.verifiedUser_id;
    console.log(verifiedUser_id);

    const orders = await Order.find({
      userId: verifiedUser_id,
      activate: true,
    });

    console.log(orders);
    if (!orders[0]) {
      console.error("사용자의 주문이 없습니다");
      console.log(
        "------------------- 마이페이지 주문조회 실패 ------------------------"
      );
      throw new Error("사용자의 주문 내역이 없습니다");
    }
    // 주문 목록 전송
    res.status(200).json(orders);
    console.log("주문 목록 전송 완료");
    console.log(
      "------------------- 마이페이지 접근 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

// 수정, 관리 페이지 접근시
router.get("/", verifyUser(), async (req, res, next) => {
  try {
    console.log(
      "-------------------  사용자 정보 관리 페이지 접근 ------------------------"
    );

    // 사용자 유효성 평가
    const verifiedUser_id = req.verifiedUser_id;

    // 유저 검색 후 데이터 전송
    const user = await User.findOne({ _id: verifiedUser_id });

    if (!user) {
      console.error("사용자의 정보가 없습니다");
      console.log(
        "------------------- 사용자 정보 검색 실패 ------------------------"
      );
      throw new Error("사용자의 정보가 없습니다");
    }

    res.status(200).json(user);
    console.log("사용자 정보 전송 완료");
    console.log(
      "------------------- 사용자 정보 관리 페이지 접근 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

// 수정 요청시
router.post("/", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 마이페이지 사용자 정보 수정 요청 ---------------------"
  );
  try {
    const verifiedUser_id = req.verifiedUser_id;

    // 수정 요청 데이터 확인
    const updateData = req.body;

    if (Object.keys(updateData).length == 0) {
      console.error("req.body 확인 실패");
      console.log(
        "------------------- 마이페이지 사용자 정보 수정 내역 확인 실패 ------------------------"
      );
      throw new Error("req.body 확인에 실패하였습니다");
    }
    if (updateData.password) {
      console.log("비밀번호 변경 감지");
      updateData.password = getHash(req.body.password);
    }
    console.log("updateData : ", updateData);

    // 유저 검색 후 수정 내역 업데이트
    await User.findByIdAndUpdate(
      { _id: ObjectId(verifiedUser_id) },
      updateData
    );
    const user = await User.findById({ _id: ObjectId(verifiedUser_id) });
    console.log("수정된 유저 : ", user);

    console.log(
      "------------------- 사용자 정보 수정 완료 ------------------------"
    );
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

// 회원 탈퇴 시도시 (비밀번호 확인 로직 추가)
router.delete("/", verifyUser(), async (req, res, next) => {
  console.log(
    "---------------- 마이페이지 회원탈퇴 요청 ---------------------"
  );
  try {
    // 사용자 유효성 평가
    const verifiedUser_id = req.verifiedUser_id;

    // 유저 입력 비밀번호 확인
    const checkpassword = await User.findOne({
      _id: ObjectId(verifiedUser_id),
    });

    if (checkpassword.password !== getHash(req.body.password)) {
      console.error("비밀번호 불일치");
      console.log(
        "------------------- 사용자 비밀번호 확인 실패 ------------------------"
      );
      throw new Error("비밀번호가 일치하지 않음");
    }

    // 유저 검색 후 비활성화
    await User.findByIdAndUpdate(
      { _id: ObjectId(verifiedUser_id) },
      { activate: false }
    );
    const user = await User.findById({ _id: ObjectId(verifiedUser_id) });

    // 비활성화 확인
    if (user.activate == false) {
      console.log("사용자 계정 비활성화 완료 : ", user.activate);
    } else {
      console.log("사용자 계정 비활성화 실패 : ", user.activate);
      throw new Error("이미 비활성 상태의 계정입니다.");
    }

    res.status(200).end();
    console.log(
      "------------------- 마이페이지 회원 탈퇴 성공 ------------------------"
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
