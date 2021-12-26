module.exports = (app) => {
  const router = require("express").Router();
  const logger = require("../../helper/LogHelper");

  // router.route("URL 경로").get || post || put || delete((req, res) => {})
  // router.get || post || put || delete("URL경로",(req, res) => {})

  //  router.route("url경로").get | post | put | delete ((req, res, next) => {});
  router.route("/page1").get((req, res, next) => {
    /**방법(1) - router 기능을 사용(권장) */
    // 브라우저에게 전달할 응답 내용
    let html = "<h1>Page1</h1>";
    html += "<h2>Express로 구현한 Node.js 백엔드 페이지</h2>";

    // 브라우저에게 전달할 결과코드
    res.status(200);
    res.send(html);
  });

  router.route("/page2").get((req, res, next) => {
    /**방법(1) - router 기능을 사용(권장) */
    // 브라우저에게 전달할 응답 내용
    let html = "<h1>Page2</h1>";
    html += "<h2>Node.js Backend Page</h2>";

    // 브라우저에게 전달할 결과코드
    res.writeHead(200);
    res.write(html);
    res.end();
  });

  router.route("/page3").get((req, res, next) => {
    /**방법(1) - router 기능을 사용(권장) */
    // 브라우저에게 전달할 응답 내용
    res.redirect("https://www.naver.com");
  });

  return router;
};
