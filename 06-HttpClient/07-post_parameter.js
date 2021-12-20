// 1) 모듈참조
const axios = require("axios");
const Formdata = require("form-data");

// 2) 접속할 서버의 호스트 이름과 요청정보(path)설정
const url = "http://itpaper.co.kr/data/post.php";

(async () => {
  let result = null;

  try {
    //   post 방식으로 전송할 파라미터 정의 --> 가상의 <form>태그를 생성
      const form = new Formdata();

    //   form태그의 input요소 추가와 같은 원리
      form.append('num1', 200);
      form.append('num2', 300);

    //Post 방식 전송
    const response = await axios.post(url, form, {
        headers: form.getHeaders()
    });
    result = response.data;
  } catch (err) {
    const errorMsg =
      "[" + error.response.status + "]" + error.response.statusText;
    console.error(errorMsg);
    return;
  }
  // todo myself...

  console.log('다른 백엔드로부터 응답받은 결과값: ' + result);
})();

// post 방식은 백엔드에 전달될 값을 http 헤더로보냄
// get 방식으로 데이터를 전달하면 get으로 받고, post 방식으로 데이터를 주면 post방식으로 받아야한다.
// 처리속도는 get방식이 빠르지만, 보안에 취약
// 대용량처리와 약간의 보안이 있는 건 post방식(get, post로 방식이 나뉜다. 나머지는 post랑 전송방식이 같음)
// 첨부파일이 있을 땐 multiport-formdata

