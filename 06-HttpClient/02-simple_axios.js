
const axios = require("axios")

// 2) 접속할 서버의 호스트 이름과 요청정보(path)설정
const url = "http://itpaper.co.kr/data/simple_text.txt";

// 3) GET 방식으로 접속하기 위한 객체 생성
axios
  .get(url).then((response) => {
    // 지정된 url의 컨텐츠를 성공적으로 가져온 경우 호출
    // --> 응답을 성공적으로 수신했다고 표현함
    console.log("Promise방식- " + response.data);
  })
  .catch((error) => {
    // 지정된 url로의 요청에 실패한 경우 호출된다.
    // 에러내용에서 상태코드(숫자)와 에러메세지만 추출
    // [HTTP 상태코드] 200(ok), 404(Page Not Found), 401(권한없음, 로그인 필요), 403(접근금지, 폴더에 접속한 경우)
    //      50x (접속대상에서 에러가 나고있는 경우)
    const errorMsg =
      "[" + error.response.status + "]" + error.response.statusText;
    console.log("Promise방식-" + errorMsg);
  })
  .finally(() => {
    // 성공 실패 여부 상관없이 마지막에 무조건 호출한다
    // 필요없다면 이 부분은 구현하지 않아도 된다.
    console.log("Promise방식-fin :)");
  });

console.log('promise방식으로 HTTP 요청');
