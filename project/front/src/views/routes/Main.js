import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ShowItemList } from "../components/ShowItemList"; // 상품 list components
import { customAxios } from "../../config/customAxios";
import cssMain from "../css/Main.module.css";

const Main = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  async function getData() {
    return await customAxios
      .get("/products")
      .then((res) => {
        const filteredData = res.data.filter(
          (f) => f.categoryName !== "None-category"
        );
        setProducts(filteredData);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getData();
  }, []);

  // Carousel
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        className={cssMain.mainCarousel}
      >
        <Carousel.Item>
          <img
            src={`${process.env.PUBLIC_URL}/img/banner1.png`}
            className={cssMain.mainBg}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={`${process.env.PUBLIC_URL}/img/banner2.png`}
            className={cssMain.mainBg}
            onClick={() => navigate("/products/63dcd6803f53abb02db79241")}
            style={{ cursor: "pointer" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={`${process.env.PUBLIC_URL}/img/banner3.png`}
            className={cssMain.mainBg}
            onClick={() => navigate("/products/63dce18004bd32773d5bb73a")}
            style={{ cursor: "pointer" }}
          />
        </Carousel.Item>
      </Carousel>

      {/* 아이템 리스트 component */}
      <ShowItemList data={products} />
    </>
  );
};

export default Main;
