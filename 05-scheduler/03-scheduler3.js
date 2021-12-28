/**
 * Crontab 스타일의 스케쥴 지정
 */

// 1) 필요한 패키지 참조하기
const logger = require('../helper/LogHelper');
const schedule = require('node-schedule');

// 2) 매 분마다 수행
schedule.scheduleJob('* * * * *', () =>  logger.info('1분에 한번씩 수행'));

// 3) 매 시 15, 45분마다 수행
schedule.scheduleJob('15,45 * * * *', () =>  logger.info('매 시 15,45분마다 수행'));


// 4) 2분마다
schedule.scheduleJob("*/2 * * * *", () => logger.warn('2분마다'));

logger.error('예약작업이 설정되었습니다.');