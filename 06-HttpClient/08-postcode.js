// 1) 모듈참조
const axios = require("axios");

// 2) 접속할 서버의 호스트 이름과 요청정보(path)설정
const url = "https://www.juso.go.kr/addrlink/addrLinkApi.do";
// const params = {
//   confmKey: "U01TX0FVVEgyMDE3MDUxOTAyNDIyMzIxMzAy",
//   currentPage: 1,
//   countPerPage: 20,
//   keyword: "서초동",
//   resultType: "json",
// };

// 3) GET 방식으로 접속하기 위한 객체 생성

(async () => {
  let json = null;

  try {
    const response = await axios.get(url, {
      params: {
        confmKey: "	U01TX0FVVEgyMDIxMTIxNzEyMTQxNTExMjA0MjM=",
        currentPage: 1,
        countPerPage: 20,
        keyword: "서초동",
        resultType: "json",
      },
    });
    json = response.data;
  } catch (err) {
    const errorMsg =
      "[" + error.response.status + "]" + error.response.statusText;
    console.log(errorMsg);
    return;
  }
  // todo myself...
  json.results.juso.map((item, index) => {
    console.log("[%s]", item.zipNo);
    console.log("[지번주소]" + item.jibunAddr);
    console.log("[도로명주소] " + item.roadAddr);
    console.log();
  });
})();
