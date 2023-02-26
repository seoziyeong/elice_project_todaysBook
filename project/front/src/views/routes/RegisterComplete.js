import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cssComplete from "../css/Complete.module.css";

const RegisterComplete = () => {
  const navigate = useNavigate();
  return (
    <Container className="subContainer">
      <div className={cssComplete.alignCenter}>
        <h2>회원가입이 완료되었습니다 📚</h2>
        <div className={cssComplete.buttons}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              navigate("/login");
            }}
          >
            로그인 하기
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "80vh",
        }}
      >
        <form style={{ display: "flex", flexDirection: "column" }}>
          <h1>회원가입이 완료되었습니다.</h1>
          <br />

          <button onClick={() => navigate("/login")}>로그인 하기</button>
        </form>
      </div>
    </Container>
  );
};

export default RegisterComplete;
