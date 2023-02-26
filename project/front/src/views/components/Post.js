import React from "react";
import DaumPostcode from "react-daum-postcode";

const Post = (props) => {
  const address = props.address1;
  const setAddress = props.setAddress1;
  const zonecode = props.zonecode;
  const setZonecode = props.setZonecode;
  //내장함수 onCompletePost 주소 검색 후 클릭 시 저절로 닫히면서 data값들 넘어옴.
  const onCompletePost = (data) => {
    setAddress(data.address);

    setZonecode(data.zonecode);
  };

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "-200px",
    left: "25%",
    width: "400px",
    height: "400px",
    padding: "7px",
    zIndex: 100,
    border: "1px solid #eee",
    backgroundColor: "white",
  };

  return (
    <div>
      <DaumPostcode
        style={postCodeStyle}
        autoClose
        onComplete={onCompletePost}
      />
    </div>
  );
};

export default Post;
