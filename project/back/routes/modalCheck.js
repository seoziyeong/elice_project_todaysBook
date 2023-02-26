const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser_middlewaring");
const getHash = require("../utils/hash-password");
const { User } = require("../models/index");

router.post("/", verifyUser(), async (req, res, next) => {
  console.log(
    "------------------- 관리페이지 모달 PW 검사 요청 ------------------------"
  );
  try {
    // 비밀번호 입력
    const { password } = req.body;
    const verifiedUser_id = req.verifiedUser_id;

    // 비밀번호 일치 확인
    const user = await User.findOne({ _id: verifiedUser_id });
    if (!user) {
      console.error("사용자의 정보가 없습니다");
      console.log(
        "------------------- 사용자 정보 검색 실패 ------------------------"
      );
      throw new Error("사용자의 정보가 없습니다");
    } else if (user.password !== getHash(password)) {
      console.error("사용자 입력 패스워드가 일치하지 않습니다");
      console.log(
        "------------------- 관리페이지 모달 PW 검사 실패 ------------------------"
      );
      throw new Error("사용자 입력 패스워드가 일치하지 않습니다");
    } else {
      console.log(
        "------------------- 관리페이지 모달 PW 검사 성공 ------------------------"
      );
    }

    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
