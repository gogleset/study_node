const path = require("path");

module.exports = {
  // 로그 파일이 저장될 경로 및 출력레벨
  log: {
    debug: {
      path: path.join(__dirname, "../_files/_logs"),
      level: "debug",
    },
    // 시스템에 심각한 문제가 발생했을떄의 정보를 저장할 파일
    error: {
      path: path.join(__dirname, "../_files/_logs"),
      level: "error",
    },
  },
  //웹 서버 포트번호
  server_port: 3000,

  /**public 디렉토리 경로 */
  public_path: path.join(__dirname, "../public"),

  /**favicon 경로*/
  favicon_path: path.join(__dirname + "../../public/favicon.png"),

  /**쿠키 저장시 사용할 도메인 */
  //1) localhost인 경우 공백으로 설정
  //2) 도메인이 itpaper.co.kr 인 경우 앞에 점을 붙여서 명시 --> "itpaper.co.kr"
  cookie_domain: "",

  /**보안 키 */
  secure: {
    cookie_encrypt_key: "1234567890",
    session_encrypt_key: "1234567890",
  },

  // 메일 발송정보
  sendmail_info: {
    host: "smtp.gmail.com", //SMTP 서버명 : smtp.gmail.com
    port: 465, //SMTP 포트 : 587
    secure: true, //보안연결(SSL)필요
    auth: { user: "choij2494@gmail.com", pass: "ootphapvcofbexow" },
  },

  /**업로드 경로 */
  upload: {
    path: "/upload",
    dir: path.join(__dirname, "../_files/upload"),
    max_size: 1024 * 1024 * 20, //최대 저장용량
    max_count: 10, //파일갯수
  },

  // 썸네일 이미지 생성 경로
  thumbnail: {
    sizes: [640, 750, 1020],
    dir: path.join(__dirname, "../_files/thumb"),
  },

  movie: {
    dir: path.join(__dirname, "../_files/movie"),
  },

  database: {
    host: "localhost", //MYSQL 서버 주소(다른 PC인 경우 IP주소)
    port: 3306, //MySQL 설치시 기본값 3306
    user: "root", // 접근권한 아이디(root=관리자)
    password: "Chlwls@213468", //설치시 입력한 비밀번호
    database: "myschool", //사용할 데이터베이스 이름
    insecureAuth: true,

    // -- 세션
    // 세션 만료시간.(지정된 시간동안 페이지 이동이 없을 경우 로그아웃)
    checkExpirationInterval: 900000,
    // 최대 유효 세션 수 (최대 동접자 수)
    expiration: 86400000,
    // DB테이블이 없을 경우 자동 생성
    createDatabaseTable: true,
    // DB테이블 구조
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
};
