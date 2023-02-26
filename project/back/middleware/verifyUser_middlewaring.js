const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const { User } = require("../models/index");

const verifyUser = (isAdmin = false) => {
  return async (req, res, next) => {
    try {
      // 토큰 확인 및 _id 추출 로직
      const { authorization } = req.headers;
      // console.log("authorization : ", authorization)

      if (!authorization) {
        console.error("Authorization 존재하지 않는다");
        throw new Error("Authorization 존재하지 않는다");
      }

      // 토큰 존재 확인
      const token = authorization.split(" ")[1];
      if (!token) {
        console.error("토큰이 존재하지 않는다");
        throw new Error("토큰이 존재하지 않는다");
      }

      // 최종적으로 jwt 토큰의 유효성 평가
      // 오류: "invalid token"
      const verifiedUser_id = jwt.verify(token, "10team");

      // console.log("verifiedUser_id : ", verifiedUser_id)

      // 관리자 권한 및 사용자 계정 활성화 확인
      const user = await User.findOne({ _id: ObjectId(verifiedUser_id) });
      if (!user) {
        console.log("사용자 계정 확인 실패");
        throw new Error("존재하지 않는 계정 입니다");
      } else {
        console.log("사용자 계정 : ", user);
        console.log("사용자 계정 확인 완료");
      }
      const { activate, admin } = user;

      // 비활성화 계정 에러
      if (!activate) {
        console.error("비활성 계정 입니다");
        throw new Error("비활성 계정 입니다");
      }

      // 관리자 페이지에서 접근시 관리자 여부 에러
      if (isAdmin && !admin) {
        console.error("관리자 계정이 아닙니다");
        throw new Error("관리자 계정이 아닙니다");
      }

      req.verifiedUser_id = verifiedUser_id;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = verifyUser;
