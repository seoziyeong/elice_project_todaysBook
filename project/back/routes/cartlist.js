const express = require("express");
const router = express.Router();
const { Product } = require("../models/index");
const mongoose = require("mongoose");

// ------ USER: 장바구니 데이터에 해당하는 상품 조회 ------
router.get("/", async (req, res, next) => {
  console.log(
    "-------------------- 장바구니 데이터 확인 및 상품 조회 요청 ------------------------"
  );
  try {
    // ------ 쿼리 스트링 ------
    let idList = req.query["_id"];
    let products;

    if (!idList) {
      // 쿼리 파라미터가 없을 때
      console.error("req.query['_id'] 없음.");
      console.log(
        "---------------- 요청 데이터 req.query['_id'] 확인 실패 ---------------------"
      );
      throw new Error("req.query['_id']가 존재하지 않습니다.");
    } else {
      // _id 값이 하나일 때 처리
      if (typeof idList !== "object") {
        idList = [idList];
      }
      // 쿼리 파라미터가 있을 때 해당 상품을 담을 products 생성
      products = await Promise.all(
        idList.map(async (_id) => {
          const product = await Product.findOne({
            _id: mongoose.Types.ObjectId(_id),
          });
          return product;
        })
      );
    }

    // 상품을 찾지 못했을 경우 에러처리
    if (!products) {
      console.error("조회된 상품 없음.");
      console.log(
        "---------------- 장바구니 데이터 확인 및 상품 조회 실패 ---------------------"
      );
      throw new Error("상품을 찾을 수 없습니다.");
    } else {
      console.log(
        "-------------------- 장바구니 데이터 확인 및 상품 조회 성공 ------------------------"
      );
    }

    res.status(200).json(products);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
