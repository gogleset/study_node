/**
 * 01-winston.js
 * -winston 패키지를 사용하여 로그 출력 살펴보기
 * $ npm install --save winston
 * $ npm install --save winston-daily-ratate-file
 */

// 1)패키지 참조
const fileHelper = require('../helper/FileHelper.js'); //로그처리모듈
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const path = require('path');

// 2)환경설정 정보
const config = {
    // 로그 파일이 저장될 경로 및 출력 레벨
    log: {
        // 개발자가 필요에 의해 기록하는 정보들을 저장할 파일
        debug: {
            path: path.join(__dirname, '../_files/_logs'),
            level: 'debug',
        }, 
        // 시스템에 심각한 문제가 발생했을 때의 정보를 저장할 파일
        error: {
            path: path.join(__dirname, '../_files/_logs'),
            level: 'error',
        },
    },
}

// 3)로그가 저장될 폴더 생성
fileHelper.mkdir(config.log.debug.path);
fileHelper.mkdir(config.log.error.path);

// 로그가 출력될 형식 지정
const {combine, timestamp, printf, splat, simple} = winston.format;

const logger = winston.createLogger({
    // 로그의 전반적인 형식
    format: combine(
        timestamp({
            // 날짜 출력형식은 https://day.js.org/docs/en/display/format 참고
            // format: 'YYYY-MM-DD HH:mm:ss',
            format: 'YY/MM/DD HH:mm:ss SSS',
            // SSS는 초단위
        }),
        // 출력부분
        printf((info) => {
            return `${info.timestamp} [${info.level}]: ${info.message}`;
        }),
        splat() //줄바꿈
    ),
    // 일반 로그 규칙 정의
    transports: [
        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: 'debug-file',
            level: config.log.debug.level, //출력할 로그의 수준
            dataPattern: 'YYMMDD', //파일 이름에 표시될 날짜 형식
            dirname: config.log.debug.path, //파일이 저장될 위치
            filename: 'log_%DATE%.log', //파일이름형식. %DATE%은 datePattern의 값
            maxsize: 500000,
            maxFile: 50,
            zippedArchive: true
            // maxsize 50mb가 넘어가면 하나의 파일을 생성, 50개가 넘어가면 zipped
        }),

        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: 'error-file',
            level: config.log.error.level,
            datePattern:'YYMMDD',//날짜형식
            dirname:config.log.error.path,
            filename:'error_%DATE%.log',
            maxsize: 500000,
            maxFile: 50,
            zippedArchive: true
        })
    ]
})