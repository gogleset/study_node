// 로그 처리 모듈

// 윈스턴 모듈화

// 1)패키지 참조
const fileHelper = require("./FileHelper"); //폴더처리모듈
const winston = require("winston");//로그처리모듈
const winstonDaily = require("winston-daily-rotate-file");//로그파일을 만들어줌
const path = require("path");
const config = require("./_config");//path

// 2)로그가 저장될 폴더 생성
fileHelper.mkdir(config.log.debug.path);
fileHelper.mkdir(config.log.error.path);

// 3)로그가 출력될 형식 지정 함수 참조
const { combine, timestamp, printf, splat, simple } = winston.format;

// 일반로그 규칙정의

const logger = winston.createLogger({
  // 로그의 전반적인 형식
  format: combine(
    timestamp({
      // 날짜 출력형식은 https://day.js.org/docs/en/display/format 참고
      // format: 'YYYY-MM-DD HH:mm:ss',
      format: "YY/MM/DD HH:mm:ss SSS",
    }),
    printf((info) => {
      return `${info.timestamp} [${info.level}]: ${info.message}`; //로그가 기록되는 형식
    }),
    splat() //실행?
  ),
  // 일반 로그 규칙 정의
  transports: [
    // 하루에 하나씩 파일 형태로 기록하기 위한 설정
    //파일과 폴더의 설정값
    new winstonDaily({
      name: "debug-file",
      level: config.log.debug.level, //출력할 로그의 수준
      datePattern: "YYMMDD", //파일 이름에 표시될 날짜 형식
      dirname: config.log.debug.path, //파일이 저장될 위치
      filename: "log_%DATE%.log", //파일이름형식. %DATE%은 datePattern의 값
      maxsize: 500000,
      maxFile: 50,
      zippedArchive: true,
    }),

    // 하루에 하나씩 파일 형태로 기록하기 위한 설정
    new winstonDaily({
      name: "error-file",
      level: config.log.error.level,
      datePattern: "YYMMDD", //날짜형식
      dirname: config.log.error.path,
      filename: "error_%DATE%.log",
      maxsize: 500000,
      maxFile: 50,
      zippedArchive: true,
    }),
  ],
});

// 5)콘솔 설정
// 프로덕션 버전 (=상용화 버전)이 아니라면?
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      prettyPrint: true,
      showLevel: true,
      level: config.log.debug.level,
      format: combine(
        winston.format.colorize(),
        printf((info) => {
          return `${info.timestamp} [${info.level}]: ${info.message}`;
        })
      ),
    })
  );
}

module.exports = logger;
