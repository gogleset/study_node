/*----------------------------------------------------------
 | 1) 모듈참조
 -----------------------------------------------------------*/
//직접 구현한 모듈
const logger = require("../helper/LogHelper");
const util = require("../helper/UtilHelper");
const fileHelper = require("../helper/FileHelper");
const config = require("../helper/_config");
const webHelper = require("../helper/WebHelper");
const BadRequestException = require("../exceptions/BadRequestException");
const PageNotFoundException = require("../exceptions/PageNotFoundException");
const RuntimeException = require("../exceptions/RuntimeException");
// 내장모듈
const url = require("url");
const path = require("path");

// 설치가 필요한 모듈
const express = require("express"); //Expess본체
const useragent = require("express-useragent"); //클라이언트의 정보를 조회할 수 있는 기능
const static = require("serve-static"); //다른폴더에서 파일을 찾고, 하위폴더의 내용을 웹상에 노출
const favicon = require("serve-favicon"); // favicon 처리
const bodyParser = require("body-parser"); //Post 파라미터 처리
const methodOverride = require("method-override"); // PUT 파라미터 처리
const cookieParser = require("cookie-parser"); //Cookie 처리
const expressSession = require("express-session"); //Session 처리
const multer = require("multer"); //업로드 모듈, 생성은 라우터 다음에 들어감.(유의!)
const nodemailer = require("nodemailer"); //메일발송 --> app.use()로 추가설정 필요없음, 자체가 함수
const thumbnail = require("node-thumbnail").thumb; //썸네일 이미지 생성모듈

const test = require("./controllers/test"); //객체 확장예제
/*----------------------------------------------------------
 | 2) Express 객체 생성
 -----------------------------------------------------------*/
// 여기서 생성한 app 객체의 use() 함수를 사용해서
// 각종 외부 기능, 설정 내용, URL을 계속해서 확장하는 형태로 구현이 진행된다
const app = express();
/*----------------------------------------------------------
 | 3) 클라이언트의 접속시 초기화
 -----------------------------------------------------------*/
/** app 객체에 UserAgent 모듈을 탑재
 * -> Express객체(app)에 추가되는 확장 기능들을 Express에서는 미들웨어라고 부른다.
 * -> 초기화 콜백함수에 전달되는 req, res객체를 확장하기 때문에
 * 다른 모듈들보다 먼저 설정되어야한다.
 */
app.use(useragent.express());

// 클라이언트의 접속을 감지(req, res는 useragent의 확장객체이다.)
app.use((req, res, next) => {
  logger.debug("클라이언트가 접속했습니다.");

  // 클라이언트가 접속한 시간
  const beginTime = Date.now();

  // 클라이언트의 IP주소
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // 클라이언트의 디바이스 정보 기록(UserAgent 사용)
  logger.debug(
    "[client]" +
      ip +
      "/" +
      req.useragent.os +
      "/" +
      req.useragent.browser +
      "(" +
      req.useragent.version +
      ") / " +
      req.useragent.platform
  );

  // 클라이언트가 요청한 페이지 URL
  // 콜백함수에 전달되는 req 파라미터는 클라이언트가 요청한 URL의 각 부분을 변수로 담고 있다.
  const current_url = url.format({
    protocol: req.protocol, //ex)http://
    host: req.get("host"), //ex) 172.16.141.1
    port: req.port, //ex) 3000
    pathname: req.originalUrl, // ex) /page.html
  });

  logger.debug("[" + req.method + "]" + decodeURIComponent(current_url));

  // 클라이언트의 접속이 종료된 경우의 이벤트
  res.on("finish", () => {
    // 접속 종료시간
    const endTime = Date.now();

    // 이번 접속에서 클라이언트가 머문 시간  = 백엔드가 실행하는게 걸린 시간
    const time = endTime - beginTime;
    logger.debug(
      "클라이언트의 접속이 종료되었습니다. ::: [runtime]" + time + "ms"
    );
    logger.debug("--------------------");
  });

  // 이 콜백함수를 종료하고 요청 URL에 연결된 기능으로 제어를 넘김
  next();
  // 현재의 미들웨어 함수가 요청-응답 주기를 종료하지 않는 경우에는 next()를 호출하여 그 다음 미들웨어 함수에 제어를 전달해야 합니다. 그렇지 않으면 해당 요청은 정지된 채로 방치됩니다. express use 문서
});
/*----------------------------------------------------------
 | 4) Express 객체의 추가 설정
 -----------------------------------------------------------*/
/**HTML, CSS, IMG, JS 등의 정적 파일을 URL에 노출시킬 폴더 연결
 * "http://아이피:포트번호"이후의 경로가 router에 등록되지 않은 경로라면
 * static 모듈에 연결된 폴더 안에서 해당 경로를 탐색한다.
 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); //TEXT형식의 파라미터 수신가능
app.use(bodyParser.json()); //JSON형식의 파라미터 수신 가능

/**
 * HTTP PUT,DELETE 전송방식 확장
 */
//  브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP HEADER 이름
app.use(methodOverride("X-HTTP-Method")); //Microsoft
app.use(methodOverride("X-HTTP-Method-Override")); //google/GData
app.use(methodOverride("X-Method-Override")); //IBM
// HTML 폼에서 PUT, DELETE로 전송할 경우 post방식을 사용하되, action 주소에 "?_method"라고 추가
app.use(methodOverride("_method"));

// HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결

/**쿠키 설정 */
app.use(cookieParser(config.secure.cookie_encrypt_key));

// 세션 설정
app.use(
  expressSession({
    //암호화 키
    secret: config.secure.session_encrypt_key,
    // 세션을 쿠키 상태로 클라이언트에게 노출시킬지 여부
    resave: false,
    // 세션이 저장되기 전에 기존의 세션을 초기화 상태로 만들지 여부
    saveUninitialized: false,
  })
);
// 테스트 파일(익스프레스 확장 예제)
// app.use(test());

/**req, res 객체의 기능을 확장하는 모듈 */
app.use(webHelper());

// HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결
app.use("/", static(config.public_path));
// --> upload 폴더의 웹 상의 위치 : http://아이피:포트번호/upload
app.use("/upload", static(config.upload.dir));
// --> 썸네일 이미지가 생성될 폴더의 웹 상의 위치 : http://아이피:포트번호/thumb
app.use("/thumb", static(config.thumbnail.dir));

/** favicon 설정 */
app.use(favicon(config.favicon_path));
//  라우터(URL 분배기)객체 설정 --> 맨 마지막에 설정
const router = express.Router(); //라우터가 됨
// 라우터를 express에 등록
app.use("/", router);
/*----------------------------------------------------------
 | 5) 각 URL별 백엔드 기능 정의
 -------------------------------------------- ---------------*/

app.use(require("./controllers/Department")(app));
app.use(require('./controllers/Student')(app));
app.use(require('./controllers/Professor')(app));
app.use(require('./controllers/Member')(app));
// 런타임 에러가 발생한 경우에 대한 일괄처리
app.use((err, req, res, next) => {
  // 에러 객체를 만들 때 생성자 파라미터로 전달한 에러메시지
  if(err instanceof BadRequestException){
    console.log("app.use로 넘어온 err 객체=%s",err);
    res.sendError(err)
  } else {
    console.log(err);
    res.sendError(new RuntimeException(err.message));
  }
});
// 앞에서 정의하지 않은 그 밖의 URL에 대한 일괄 처리
app.use("*", (req, res, next) => {
  const err = new PageNotFoundException();
  res.sendError(err);
});

/*----------------------------------------------------------
 | 6) 설정한 내용을 기반으로 서버 구동 시작
 -----------------------------------------------------------*/
// 백엔드를 가동하고 3000번 포트에서 대기
const ip = util.myip();

app.listen(config.server_port, () => {
  logger.debug("-----------------------");
  logger.debug("| Start Express Server |");
  logger.debug("-----------------------");

  ip.forEach((v, i) => {
    logger.debug("server address => http://" + v + ":" + config.server_port);
  });

  logger.debug("-----------------------");
});
