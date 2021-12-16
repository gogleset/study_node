// 모든 노드 프로젝트마다 다음을 우선 수행해야한다

/**
 * 1. /helper/_config.js 파일을 통해 로그의 수준과 저장 경로를 지정
 * 2. 필요하다면 /helper/log_helper.js에서 로그의 출력 형식이나 저장파일이름 형식을 수정
 * 3.모든 노드js 파일에서 log_helper를 require 
 * 4.브라우저용 Js에서 console.log를 사용하듯 노드에서 logger.debug를 사용.
 * --> 웹브라우저의 콘솔 대신 지정된 파일에 출력내용들이 기록된다.
 * --> 이 내용을 확인하여 백엔드의 실행 과정을 가늠할 수 있다
 */

const logger = require('../helper/LogHelper');

logger.error('error 메시지 입니다.');
logger.warn('warn 메시지 입니다.');
logger.info('info 메시지 입니다.');
// logger.http('http 메시지 입니다.')
logger.debug('debug 메시지 입니다.');
logger.verbose('verbose 메시지 입니다.');
console.log('Hello World');