/**
 * 특정 시각에 한번만 수행되는 예약작업 만들기
 * 
 * $ npm install --save dayjs
 * $ npm install --save node-schedule
 */

// 1) 필요한 패키지 참조하기
const logger = require('../helper/LogHelper');
const dayjs = require('dayjs');
const schedule = require('node-schedule');

// 2) 예약작업이 실행될 시간
// 현재 시각
const atTime = dayjs();
logger.debug(atTime.format('HH:mm:ss'));


// 5초 후 시각
const afTime = atTime.add(5, 'second')
logger.debug(afTime.format('HH:mm:ss'));


// 3) 5초 후에 자동으로 실행되는 예약 작업을 생성
// js 의 Date 객체를 추출
console.log(afTime.toDate());
const jsDate = afTime.toDate();
// 첫번째 파라미터는 시간형식의 파라미터를 주면 알아서 실행됨
schedule.scheduleJob(jsDate, () => {
    logger.debug('5초 후 예약된 작업이 수행되었습니다.');
});

logger.debug(afTime.format('HH:mm:ss')+ '에 작업이 예약되었습니다.');