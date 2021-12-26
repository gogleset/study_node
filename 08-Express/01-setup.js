/*----------------------------------------------------------
 | 1) 모듈참조
 -----------------------------------------------------------*/
//직접 구현한 모듈 
const logger = require('../helper/LogHelper');
const util = require('../helper/UtilHelper');

// 내장모듈
const url = require('url');
const path = require('path');

// 설치가 필요한 모듈
const express = require('express'); //Expess본체
const useragent = require('express-useragent'); //클라이언트의 정보를 조회할 수 있는 기능
const static = require('serve-static'); //다른폴더에서 파일을 찾고, 하위폴더의 내용을 웹상에 노출
const favicon = require('serve-favicon'); // favicon 처리

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

// 클라이언트의 접속을 감지
app.use((req, res, next) => {
    logger.debug('클라이언트가 접속했습니다.');

    // 클라이언트가 접속한 시간
    const beginTime = Date.now();

    // 클라이언트의 IP주소 
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    // 클라이언트의 디바이스 정보 기록(UserAgent 사용)
    logger.debug('[client]' + ip + '/' + req.useragent.os + '/' + req.useragent.browser + '(' + req.useragent.version +') / ' + req.useragent.platform);

    // 클라이언트가 요청한 페이지 URL 
    // 콜백함수에 전달되는 req 파라미터는 클라이언트가 요청한 URL의 각 부분을 변수로 담고 있다.
    const current_url = url.format({
        protocol: req.protocol, //ex)http://
        host: req.get('host'), //ex) 172.16.141.1
        port: req.port, //ex) 3000
        pathname: req.originalUrl, // ex) /page.html
    });

    logger.debug('[' + req.method + ']' + decodeURIComponent(current_url));

    // 클라이언트의 접속이 종료된 경우의 이벤트
    res.on('finish', () => {
        // 접속 종료시간
        const endTime = Date.now();

        // 이번 접속에서 클라이언트가 머문 시간  = 백엔드가 실행하는게 걸린 시간
        const time = endTime - beginTime;
        logger.debug('클라이언트의 접속이 종료되었습니다. ::: [runtime]' + time + 'ms');
        logger.debug('--------------------');
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

//  public 폴더 안에있는 모든 html파일을 실행시켜줌
 const public_path = path.join(__dirname, '../public');
//  static = 지정된 폴더에서 파일을 찾음 하위 폴더를 웹상에 노출시키는게 가능함
 app.use('/', static(public_path));


 /** favicon 설정 */
 app.use(favicon(public_path + '/favicon.png'));

//  라우터(URL 분배기)객체 설정 --> 맨 마지막에 설정
const router = express.Router(); //라우터가 됨
// 라우터를 express에 등록
app.use('/', router);

/*----------------------------------------------------------
 | 5) 각 URL별 백엔드 기능 정의
 -----------------------------------------------------------*/
//  router.route("url경로").get | post | put | delete ((req, res, next) => {});
router.route('/page1').get((req, res, next) => {
    /**방법(1) - router 기능을 사용(권장) */
    // 브라우저에게 전달할 응답 내용
    let html = '<h1>Page1</h1>';
    html += '<h2>Express로 구현한 Node.js 백엔드 페이지</h2>';

    // 브라우저에게 전달할 결과코드
    res.status(200);
    res.send(html);
});

router.route('/page2').get((req, res, next) => {
    /**방법(2) - express 기능을 사용 */
    // 브라우저에게 전달할 응답 내용
    let html = '<h1>Page2</h1>';
    html += '<h2>Node.js Backend Page</h2>';

  // 브라우저에게 전달할 결과코드
    res.writeHead(200);
    res.write(html);
    res.end();
});

router.route('/page3').get((req, res, next) => {
    /**방법(3) - router 기능을 사용(권장) */
    // 브라우저에게 전달할 응답 내용
    res.redirect('https://www.naver.com')
});






/*----------------------------------------------------------
 | 6) 설정한 내용을 기반으로 서버 구동 시작
 -----------------------------------------------------------*/
// 백엔드를 가동하고 3000번 포트에서 대기
const port = 3000;
const ip = util.myip();

app.listen(port, () => {
    logger.debug('-----------------------');
    logger.debug('| Start Express Server |')
    logger.debug('-----------------------');

    ip.forEach((v, i) => {
        logger.debug('server address => http://' + v + ':' + port);
    });

    logger.debug('-----------------------');
})
