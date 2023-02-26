const express = require("express");
const verifyUser = require("../middleware/verifyUser_middlewaring");
const router = express.Router();
const { Product, Order, User } = require("../models/index");
const imageUploader = require("../middleware/imageUploader");

// ------ ADMIN: 상품 등록 ------
router.post(
  "/products",
  verifyUser(true),
  imageUploader.single("img"),
  async (req, res, next) => {
    console.log(
      "------------------- 관리자 상품 등록 시도 -----------------------"
    );
    try {
      const products = req.body;

      if (Object.keys(products).length == 0) {
        console.error("Body 없음.");
        console.log(
          "---------------- 요청 데이터 Body 확인 실패 ---------------------"
        );
        throw new Error("Body 내용이 없습니다.");
      }

      const product = await Product.create({
        ...products,
        img: req.file.location,
      });

      console.log("상품 등록 : ", product);
      console.log(
        "---------------- 관리자 상품 데이터 생성 성공 ---------------------"
      );

      res.status(200).json({ ...products, img: req.file.location });
    } catch (e) {
      next(e);
    }
  }
);

// ------ ADMIN: 상품 수정 ------
router.patch(
  "/products/:_id",
  verifyUser(true),
  imageUploader.single("img"),
  async (req, res, next) => {
    console.log(
      "-------------------- 관리자 상품 수정 시도 ------------------------"
    );
    try {
      // 파람 확인, 상품 식별
      const { _id } = req.params;
      if (_id == ":_id") {
        console.error("params 없음.");
        console.log(
          "---------------- 요청 데이터 Params 확인 실패 ---------------------"
        );
        throw new Error("params 내용이 없습니다.");
      }

      // 바디 확인
      const updateData = req.body;
      if (Object.keys(updateData).length == 0) {
        console.error("Body 없음.");
        console.log(
          "---------------- 요청 데이터 Body 확인 실패 ---------------------"
        );
        throw new Error("Body 내용이 없습니다.");
      }

      // 전송된 이미지 파일 유무에 따라 분기
      if (req.file) {
        await Product.findOneAndUpdate(
          { _id },
          {
            ...updateData,
            img: req.file.location,
          }
        );
        console.log("새로운 이미지 업로드 및 저장 완료");
      } else {
        const product = await Product.findOne({ _id });
        await Product.findOneAndUpdate(
          { _id },
          {
            ...updateData,
            img: product.img,
          }
        );
      }

      // 업데이트 여부 확인
      const updatedProduct = await Product.findOne({ _id });
      console.log("수정된 상품 데이터 : ", updatedProduct);
      console.log(
        "---------------- 관리자 상품 데이터 수정 성공 ---------------------"
      );

      res.status(200).end();
    } catch (e) {
      next(e);
    }
  }
);

// ------ ADMIN: 상품 삭제 (비활성화) ------
router.delete("/products/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "---------------- 관리자 상품 삭제(비활성화) 시도 ---------------------"
  );
  try {
    const { _id } = req.params;
    if (!_id) {
      console.error("params 없음.");
      console.log(
        "---------------- 요청 데이터 Params 확인 실패 ---------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    await Product.findOneAndUpdate({ _id }, { activate: false });
    console.log(
      "------------------ 관리자 상품 삭제(비활성화) 성공 ----------------------"
    );

    const product = await Product.findOne({ _id });

    if (product.activate == false) {
      console.log("관리자 상품 비활성화 완료 activate : ", product.activate);
    } else {
      console.error("관리자 상품 비활성화 실패");
      console.log(
        "---------------- 관리자 상품 내역 삭제(비활성화) 실패 ---------------------"
      );
      throw new Error("관리자 상품 삭제(비활성화) 실패");
    }

    console.log(
      "---------------- 사용자 주문 내역 삭제(비활성화) 성공 ---------------------"
    );

    // 전체 상품 반환
    const products = await Product.find({});

    // 상품을 찾지 못했을 경우 에러처리
    if (!products) {
      console.errer("상품 조회 실패");
      console.log("---------------- 상품 조회 실패 ---------------------");
      throw new Error("상품을 찾을 수 없습니다.");
    }
    console.log(
      "---------------- 사용자 주문 내역 삭제(비활성화)  전체 상품 반환 ---------------------"
    );
    res.status(200).send(products);
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 전체 유저 주문 내역 조회 ------
router.get("/orders", verifyUser(true), async (req, res, next) => {
  console.log("--------------- 관리자 주문 내역 조회 시도 ------------------");
  try {
    // 모든 주문내역 찾기
    const totalOrders = await Order.find({});
    if (!totalOrders[0]) {
      console.error("관리자 : 존재하는 주문 내역이 없음.");
      console.log(
        "----------------- 관리자 주문 조회 실패 ---------------------"
      );
      throw new Error("관리자 :  존재하는 주문 내역이 없습니다.");
    } else {
      console.log(
        "----------------- 관리자 주문 내역 조회 성공 ------------------"
      );
    }

    res.status(200).json(totalOrders);
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 주문 내역 수정 (배송상태) ------
router.patch("/orders/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 관리자 주문 내역(배송상태) 수정 시도 ------------------"
  );
  try {
    const { _id } = req.params;
    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "--------------- 요청 데이터 Params 확인 실패 ------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    const updateData = req.body;
    if (Object.keys(updateData).length == 0) {
      console.error("req.body에 status 없음.");
      console.log(
        "--------------- 요청 데이터 Body 확인 실패 ------------------"
      );
      throw new Error("req.body에 status가 존재하지 않습니다.");
    }

    await Order.findOneAndUpdate({ _id }, { status: updateData.status });
    const order = await Order.findById({ _id });

    if (order.status !== updateData.status) {
      console.log("관리자 주문 배송상태 수정 실패 : ", order.status);
      console.log(
        "----------------- 관리자 주문 내역(배송상태) 수정 실패 ------------------"
      );
      throw new Error("사용자 정보 수정에 실패.");
    } else {
      console.log("사용자 주문 배송상태 수정 성공 : ", order.status);
    }

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 주문내역 삭제 (비활성화) ------
router.delete("/orders/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 관리자 주문 내역 삭제(비활성화) 시도 ------------------"
  );
  try {
    const { _id } = req.params;
    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "---------------- 요청 데이터 Params 확인 실패 ---------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    await Order.findOneAndUpdate({ _id }, { activate: false });
    const order = await Order.findOne({ _id });

    if (order.activate == false) {
      console.log(
        "관리자 주문 내역 비활성화 완료 : activate : ",
        order.activate
      );
    } else {
      console.log("관리자 주문 내역 비활성화 실패");
      console.log(
        "---------------- 주문 내역 삭제(비활성화) 실패 ---------------------"
      );
      throw new Error("관리자 주문 내역 비활성화 실패.");
    }
    console.log(
      "----------------- 관리자 주문 내역 삭제(비활성화) 성공 ------------------"
    );

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 비활성 주문 내역 완전 삭제 ------
router.delete("/falseOrders/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 관리자 비활성 주문 내역 완전 삭제 시도 ------------------"
  );
  try {
    const { _id } = req.params;

    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "--------------- 요청 데이터 Params 확인 실패 ------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    const order = await Order.findOne({ _id });
    console.log("order:", order);
    if (order === null) {
      console.error("존재하지 않는 주문입니다.");
      console.log(
        "---------------- 관리자 비활성 주문 내역 완전 삭제 실패 ---------------------"
      );
      throw new Error("존재하지 않는 주문입니다.");
    }

    if (order.activate) {
      console.error("현재 주문 내역은 비활성 상태가 아닙니다.");
      console.log(
        "---------------- 관리자 비활성 주문 내역 완전 삭제 실패 ---------------------"
      );
      throw new Error("비활성 상태인 주문목록이 없습니다");
    } else {
      console.log(`비활성 상태의 주문을 완전히 삭제합니다.`);
      await Order.deleteOne({ _id, activate: false });
      console.log(
        "---------------- 관리자 비활성 주문 내역 완전 삭제 성공 ---------------------"
      );
    }

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 카테고리 삭제 (비활성화)  ------
router.delete("/category", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 관리자 카테고리 삭제 (비활성화) 시도 ------------------"
  );
  try {
    const updateData = req.body;

    if (Object.keys(updateData).length == 0) {
      console.error("body 없음.");
      console.log(
        "---------------- 요청 데이터 Body 확인 실패 ---------------------"
      );
      throw new Error("req.body에 categoryName이 존재하지 않습니다.");
    }

    await Product.updateMany(
      { categoryName: updateData.categoryName },
      { categoryName: "None-category" }
    );
    console.log(
      "---------------- 관리자 카테고리 삭제 (비활성화) 성공 ---------------------"
    );

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 전체 사용자 정보 조회  ------
router.get("/users", verifyUser(true), async (req, res, next) => {
  console.log("--------------- 관리자 :  사용자 조회 시도 ------------------");
  try {
    // 모든 사용자 정보 찾기
    const totalUsers = await User.find({});
    if (!totalUsers[0]) {
      console.error("관리자 : 존재하는 사용자 정보가 없음.");
      console.log(
        "----------------- 관리자 사용자 조회 실패 ---------------------"
      );
      throw new Error("관리자 :  존재하는 사용자 정보 정보가 없습니다.");
    } else {
      console.log(
        "----------------- 관리자 :  사용자 조회 성공 ------------------"
      );
    }

    res.status(200).json(totalUsers);
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 사용자 권한 변경   ------
router.patch("/users/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 사용자 정보 (권한) 수정 시도 ------------------"
  );
  try {
    const { _id } = req.params;
    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "--------------- 요청 데이터 Params 확인 실패 ------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    const updateData = req.body;
    if (Object.keys(updateData).length == 0) {
      console.error("req.body에 admin 없음.");
      console.log(
        "--------------- 요청 데이터 Body 확인 실패 ------------------"
      );
      throw new Error("req.body에 admin이 존재하지 않습니다.");
    }

    await User.findOneAndUpdate({ _id }, { admin: updateData.admin });
    const user = await User.findById({ _id });

    if (user.admin !== updateData.admin) {
      console.log("사용자 정보 (권한) 수정 실패 : ", user.status);
      console.log(
        "----------------- 사용자 정보 (권한) 수정 실패 ------------------"
      );
      throw new Error("사용자 정보 (권한) 수정에 실패.");
    } else {
      console.log("사용자 정보 (권한) 수정 성공 : ", user.status);
    }

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 사용자 비활성화  ------
router.delete("/users/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 사용자 정보 삭제(비활성화) 시도 ------------------"
  );
  try {
    const { _id } = req.params;
    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "---------------- 요청 데이터 Params 확인 실패 ---------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    await User.findOneAndUpdate({ _id }, { activate: false });
    const user = await User.findOne({ _id });

    if (user.activate == false) {
      console.log("관리자 사용자 비활성화 완료 : activate : ", user.activate);
    } else {
      console.log("관리자 사용자 비활성화 실패.");
      console.log(
        "---------------- 사용자 정보 삭제(비활성화) 실패 ---------------------"
      );
      throw new Error("관리자 사용자 정보 비활성화 실패.");
    }
    console.log(
      "----------------- 관리자 사용자 정보 삭제(비활성화) 성공 ------------------"
    );

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// ------ ADMIN: 비활성 사용자 완전 삭제 ------
router.delete("/falseUsers/:_id", verifyUser(true), async (req, res, next) => {
  console.log(
    "----------------- 관리자 비활성 사용자 완전 삭제 시도 ------------------"
  );
  try {
    const { _id } = req.params;

    if (_id == ":_id") {
      console.error("params 없음.");
      console.log(
        "--------------- 요청 데이터 Params 확인 실패 ------------------"
      );
      throw new Error("params 내용이 없습니다.");
    }

    const user = await User.findOne({ _id });
    console.log("user:", user);
    if (user === null) {
      console.error("존재하지 않는 사용자입니다.");
      console.log(
        "---------------- 관리자 비활성 사용자 완전 삭제 실패 ---------------------"
      );
      throw new Error("존재하지 않는 사용자입니다.");
    }

    if (user.activate) {
      console.error("현재 사용자는 비활성 상태가 아닙니다.");
      console.log(
        "---------------- 관리자 비활성 사용자 완전 삭제 실패 ---------------------"
      );
      throw new Error("비활성 상태인 주문목록이 없습니다");
    } else {
      console.log(`비활성 상태의 사용자를 완전히 삭제합니다.`);
      await User.deleteOne({ _id, activate: false });
      console.log(
        "---------------- 관리자 비활성 사용자 완전 삭제 성공 ---------------------"
      );
    }

    res.status(200).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
