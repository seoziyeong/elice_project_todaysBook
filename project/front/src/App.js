import "./views/css/App.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import Main from "./views/routes/Main";
import Register from "./views/routes/Register";
import Login from "./views/routes/Login";
import Cart from "./views/routes/Cart";
import Detail from "./views/routes/Detail";
import List from "./views/routes/List";
import RegisterComplete from "./views/routes/RegisterComplete";
import AcountOrder from "./views/routes/AcountOrder";
import AcountPrivacy from "./views/routes/AcountPrivacy";
import Secession from "./views/routes/Secession";
import AdminProductRegister from "./views/routes/AdminProductRegister";
import Order from "./views/routes/Order";
import Complete from "./views/routes/Complete";
import AdminDeliver from "./views/routes/AdminDeliver";
import AdminCategory from "./views/routes/AdminCategory";
import AdminUsers from "./views/routes/AdminUsers";
import AdminProductCorrection from "./views/routes/AdminProductCorrection";
function App() {
  const navigate = useNavigate();

  // JWT 토큰 localstorage 저장
  const JWT = localStorage.getItem("JWT");

  // admin 여부 검증
  let isAdmin = false;
  if (localStorage.getItem("admin") == "Admin-Access-succeeded") {
    isAdmin = true;
  }

  // 로그아웃
  function logOutUser() {
    localStorage.removeItem("JWT");
    if (localStorage.getItem("admin")) {
      localStorage.removeItem("admin");
    }
    alert("로그아웃 완료");
    navigate("/");
  }

  return (
    <div className="App">
      {/* 내비게이션 */}
      <Navbar variant="light">
        <Container>
          <Nav className="me-auto">
            <div
              className="nav-logo"
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={`${process.env.PUBLIC_URL}/img/logo.png`} />
            </div>
            <Nav.Link
              onClick={() => {
                navigate("/product/list");
              }}
            >
              PRODUCT
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {JWT == null ? (
              <>
                <Nav.Link
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  회원가입
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  로그인
                </Nav.Link>
              </>
            ) : isAdmin ? (
              <>
                <Nav.Link
                  onClick={() => {
                    logOutUser();
                  }}
                >
                  로그아웃
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  관리자페이지
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/account/orders");
                  }}
                >
                  마이페이지
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  onClick={() => {
                    logOutUser();
                  }}
                >
                  로그아웃
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    navigate("/account/orders");
                  }}
                >
                  마이페이지
                </Nav.Link>
              </>
            )}

            <Nav.Link
              onClick={() => {
                navigate("/cart");
              }}
            >
              CART
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* 라우터 */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/list" element={<List />} />
        <Route path="/products/:id" element={<Detail />} />
        <Route path="/registercomplete" element={<RegisterComplete />} />
        <Route path="/account/orders" element={<AcountOrder />} />
        <Route path="/account/privacy" element={<AcountPrivacy />} />
        <Route path="/account/secession" element={<Secession />} />
        <Route path="/admin/products" element={<AdminProductRegister />} />
        <Route
          path="/admin/category/products/:id"
          element={<AdminProductCorrection />}
        />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin" element={<AdminDeliver />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/complete" element={<Complete />} />
        <Route path="*" element={<p>404</p>} />
      </Routes>
    </div>
  );
}

export default App;
