const express = require("express");
const router = express.Router();
const getHash = require("../utils/hash-password");
const { User } = require("../models/index");
// jwt 생성 모듈
const generateToken = require("../utils/generateToken");

// 로그인 패스 접근시 (로그인 버튼 클릭시)
router.post("/", async (req, res, next) => {
  try {
    // req에 담겨있는 정보 (아이디와 패스워드)를 받아서
    console.log(
      "------------------- 사용자 로그인 시도 ------------------------"
    );
    const { email, password } = req.body;

    console.log("사용자 입력 : ", email);
    console.log("사용자 입력 : ", password);

    // 데이터 베이스에 매칭되는 사용자 정보가 있는지 확인
    const user = await User.findOne({ email });
    console.log("user : ", user);

    // user 가 없으면 매칭되는 이메일이 없다
    if (!user) {
      // 일치하는 이메일이 없음 -> 에러
      console.error("user가 없음");
      console.log(
        "------------------- 사용자 로그인 실패 ------------------------"
      );
      throw new Error("일치하는 사용자 이메일이 없음");
    }

    // 찾은 user의 비밀번호와 입력된 비밀번호 일치 여부 확인
    console.log("user.password : ", user.password);
    console.log("getHash(password) : ", getHash(password));

    // 비밀번호가 일치 하지 않음 -> 에러
    if (user.password !== getHash(password)) {
      console.error("비밀번호 불일치");
      console.log(
        "------------------- 사용자 로그인 실패 ------------------------"
      );
      throw new Error("비밀번호가 일치하지 않음");
    }

    // 계정 활성화 여부 activate 확인하기
    if (user.activate !== true) {
      console.error("비활성화 상태의 계정");
      console.log(
        "------------------- 사용자 로그인 실패 ------------------------"
      );
      throw new Error("비활성화 상태의 계정");
    }

    // 로그인 성공 jwt token 생성
    console.log(
      "------------------- 사용자 토큰 발급 시도 ------------------------"
    );
    const token = generateToken(user._id.toJSON());

    // 응답으로 JWT 전송
    if (user.admin) {
      console.log(
        "------------------- 관리자 토큰 발급 완료 ------------------------"
      );
      res.status(200).json({
        JWT: token,
        admin: true,
      });
    } else {
      res.status(200).json({ JWT: token });
      console.log(
        "------------------- 사용자 토큰 발급 완료 ------------------------"
      );
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
