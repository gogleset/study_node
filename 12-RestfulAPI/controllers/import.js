// department 테이블에 대한 CRUD 기능을 수행하는 Restful API

// 모듈 참조부분
const axios = require("axios");
const router = require("express").Router();


// 라우팅 정의 부분
module.exports = (app) => {
  //   데이터 삭제 --> DELETE
  router.post("/import", async (req, res, next) => {
    let json = null;
    // 데이터 삭제하기
    const { imp_uid, merchant_uid } = req.body; //req의 body에서 imp_uid(결제번호), merchant_uid(주문번호) 추출
    console.log("결제번호 :::" + imp_uid);
    console.log("주문번호 :::" + merchant_uid);
    try {
      const getToken = await axios.post(
        "https://api.iamport.kr/users/getToken",
        {
          imp_key: "2254345424515605", // REST API 키
          imp_secret:
            "28bffa45a4190ad51c9b435bfafe2979414cbe8d48597d282441ce713f1554c606d5366addc442c0", // REST API Secret
        }
      );
      const { access_token } = getToken.data.response;
      console.log("accessToken");

      console.log(access_token);

      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const getPaymentData = await axios.get(
        `https://api.iamport.kr/payments/${imp_uid}`,
        {
          // imp_uid 전달
          headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
        }
      );

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      
      json = paymentData;
    } catch (e) {
      return next(e);
    }
    console.log("json데이터");
    console.log(json);
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.status(200).send(json)
  });
  return router;
};
