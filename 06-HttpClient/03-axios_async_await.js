// 1) 모듈참조
const http = require("http"); // <-- node 내장모듈이므로 추가 설치 안함.
const axios = require("axios");

// 2) 접속할 서버의 호스트 이름과 요청정보(path)설정
const url = "http://itpaper.co.kr/data/simple_text.txt";

// 3) GET 방식으로 접속하기 위한 객체 생성

(async () => {
  let result = null;

  try {
    const response = await axios.get(url);

    //정상적으로 처리에 성공한 경우 promise 방식의 첫 번째 then의 역할은 이 위치에서 자연스럽게 코드가 이어진다.
    // 첫 번째 then의 callback함수에 전달되던 파라미터는 앞에서 리턴받은 response
    result = response.data;
  } catch (err) {
    // 에러가 발생한 경우 실행되는 부분
    // promise 방식의 catch에 해당
    const errorMsg =
      "[" + error.response.status + "]" + error.response.statusText;
    console.log("즉시실행함수방식-" + errorMsg);
    return;
  }

  //   promise 방식의 마지막 then은 뒷부분에 일반코드로 작성한다.
  console.log("async-await방식 - " + result);
})();

console.log("async/await.즉시실행방식으로 HTTP 요청");
