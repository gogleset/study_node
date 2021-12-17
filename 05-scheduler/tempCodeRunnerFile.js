/**
 * 스케쥴에 따른 자동 수행
 */

// 1) 필요한 패키지 참조하기
const logger = require('../helper/LogHelper');
const schedule = require('node-schedule');

// 2)매 분 30초마다 수행
const rule1 = new schedule.RecurrenceRule();
rule1.second = 30;
console.log(typeof rule1.second);