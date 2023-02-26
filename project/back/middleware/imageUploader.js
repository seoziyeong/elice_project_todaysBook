const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
  region: "ap-northeast-2", // AWS의 region 값
  accessKeyId: "AKIASA22XFKTC5X3HJ5X",
  secretAccessKey: "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",

  // 테스트 후 배포할 때는 보안을 위해 env 파일로 변경해주기.
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
});

const s3 = new AWS.S3();

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp"]; // 업로드 가능한 이미지 확장자명 리스트 작성

const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: "10team-img-storage",
    key: (req, file, callback) => {
      console.log(file);
      console.log(req.body);
      const uploadDirectory = "Books"; // 버킷 내에 생성되어있는 products imgs 폴더에 업로드
      const extension = path.extname(file.originalname); // 확장자명 얻어오기

      // 올바른 확장자가 들어왔는지 확인
      if (!allowedExtensions.includes(extension)) {
        return callback(new Error("wrong extension"));
      }
      callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`); // 현재시간_파일이름 으로 이미지 파일 생성
    },
    acl: "public-read-write",
  }),
});

module.exports = imageUploader;
