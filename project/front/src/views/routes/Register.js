import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingLabel, Button, Form } from "react-bootstrap";
import { customAxios } from "../../config/customAxios";
import { Regex } from "../components/Regex";
import styles from "../css/Login.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const onNameHandler = (event) => {
    setName(event.target.value);
  };
  const onEmailHandler = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.target.value);
  };
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value);
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    //입력 확인
    if (name.length < 2) {
      return alert("이름은 2글자  이상 입력해주세요.");
    } else if (!Regex(password)) {
      return alert("영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.");
    } else if (!Regex(email)) {
      return alert("이메일 형식이 맞지 않습니다.");
    } else if (password !== confirmPassword) {
      return alert("비밀번호가 비밀번호 확인과 일치하지 않습니다.");
    } else {
      return await customAxios
        .post("/register", {
          userName: name,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data.message === "이미 존재하는 이메일입니다.") {
            alert("이미 존재하는 이메일 입니다.");
          } else {
            alert("정상적으로 회원가입되었습니다.");

            navigate("/registercomplete");
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  return (
    <div>
      <form className={styles.loginForm}>
        <h1 className={styles.title}>회원가입</h1>
        <FloatingLabel
          controlId="floatingInput"
          label="이름"
          className="mb-3"
          value={name}
          onChange={onNameHandler}
        >
          <Form.Control type="text" placeholder="엘리스" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingEmail"
          label="이메일 주소"
          className="mb-3"
          value={email}
          onChange={onEmailHandler}
        >
          <Form.Control type="email" placeholder="example@elice.com" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPassword"
          label="패스워드"
          className="mb-3"
          value={password}
          onChange={onPasswordHandler}
          type="password"
          placeholder="******"
        >
          <Form.Control type="password" placeholder="Password" />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingPasswordConfirm"
          label="패스워드 확인"
          className="mb-3"
          value={confirmPassword}
          onChange={onConfirmPasswordHandler}
          type="password"
        >
          <Form.Control type="password" placeholder="Password" />
        </FloatingLabel>
        <Button
          variant="primary"
          size="lg"
          onClick={(event) => {
            onSubmitHandler(event);
          }}
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Register;
