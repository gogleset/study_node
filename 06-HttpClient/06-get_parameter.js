const axios = require("axios");

const url = "http://itpaper.co.kr/data/get.php";


(async () => {
  let result = null;

  try {
    const response = await axios.get(url, {
      // json 방식의 params의 객체를 보내줄 수 있다.
      params: {
        num1: 200,
        num2: 800
      }
    });
    
    result = response.data;
  } catch (err) {
    const errorMsg =
      "[" + error.response.status + "] " + err.response.statusText;
    console.error(errorMsg);
    return;
  }


  console.log("다른 백엔드로부터 응답받은 결과값", result);
})();
