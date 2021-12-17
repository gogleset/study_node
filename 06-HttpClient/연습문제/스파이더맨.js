// 1) 모듈참조
const axios = require("axios");

// 페이지 열림과 동시에 실행됨
const date = new Date();
// 하루 전을 계산
const b = date.getDate() - 1;
date.setDate(b);

const yy = date.getFullYear();
const mm = date.getMonth() + 1;
const dd = date.getDate();

if (mm < 10) {
  mm = "0" + mm;
}
if (dd < 10) {
  dd = "0" + dd;
}

const sendDate = "" + yy + mm + dd;
console.log(sendDate);

// 2) 접속할 서버의 호스트 이름과 요청정보(path)설정
const url =
  "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";

const params = {
  key: "d145fd2512b2f9be50d440aedfa4b898",
  targetDt: sendDate,
};

// 3) GET 방식으로 접속하기 위한 객체 생성

(async () => {
  let json = null;
  let d = {
      movieNm : "1위 영화이름: ",
      audiCnt : "일별 영화관객수: "
  };
  try {
    const response = await axios.get(url, {params});
    // console.log(json[0].audiCnt);
    json = response.data.boxOfficeResult.dailyBoxOfficeList;
  } catch (err) {
    const errorMsg =
      "[" + error.response.status + "]" + error.response.statusText;
    console.log(errorMsg);
    return;
  }
  // todo myself...
  
  d.movieNm += json[0].movieNm;
  d.audiCnt += json[0].audiCnt + "명";
  
  console.log(d.movieNm);
  console.log(d.audiCnt);
})();
