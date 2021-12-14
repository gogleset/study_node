// 1) 모듈 참조하기

// 'querstring'은 url에서 추출한 값을 json객체로 변환과 url변수값으로 바꿔줄 수 있다.
const qs = require('querystring');
const url = require('url');


/**
 * 2) URL에서 querystring 부분만 추출
 * 분석할 URL에서 쿼리부분만 추출하기
 */
const address = 'http://www.itpaper.co.kr:8785/hello/world.html?a=123&b=456#home'


// 비구조 문법으로 query데이터만 추출
const {query} = url.parse(address);
console.debug(query);


/** 3) 추출한 querystring을 JSON 객체로 변환*/
const mydata = qs.parse(query);
console.debug(mydata);
// URL에서 추출한 모든 변수는 string 타입이다.
console.debug('요청 파라미터 중 a의 값 : %s (%s)', mydata.a, typeof mydata.a);
console.debug('요청 파라미터 중 b의 값 : %s (%s)', mydata.b, typeof mydata.b);


//4) Json 객체를 QueryString 문자열로 변환
//URL에 포함될 수 없는 글자는 자동으로 Encoding 처리함
const obj = { name: 'hello', nick: 'world', 'address':'서울시 서초구'};
const str = qs.stringify(obj);
console.log('조합된 요청 파라미터: %s', str);
