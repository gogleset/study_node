// 1) url 모듈 참조하기
const url = require('url');

// 2) 주소 문자열을 URL 객체로 만들기
const myurl = 'http://www.itpaper.co.kr:8785/hello/world.html?a=123&b=456#home';

// URL의 각 성분을 분해 --> javascript의 location 객체와 동일한 기능
const location = url.parse(myurl);

console.group("URL 성분 정보 확인");
console.debug(location);
console.debug('href: ' +location.href);
console.debug('protocol: ' +location.protocol);
console.debug('port: ' +location.port);
console.debug('host: ' +location.host);
console.debug('hostname: ' +location.hostname);
console.debug('path: ' +location.path);
console.debug('pathname: ' +location.pathname);
console.debug('search: ' +location.search);
console.debug('query: ' +location.query);
console.debug('hash: ' +location.hash);
console.groupEnd();


/**
 * 3)Json 객체를 주소 문자열로 만들기
 * 불필요한 정보를 제외할 수 있다.
 */

const info = {
    protocol: 'http:',
    hostname: 'www.itpaper.co.kr',
    port: '8080',
    pathname: '/hello/world.html',
    search:'?name=노드JS&age=10',
    hash:'#target'
}

const urlString = url.format(info);
console.group("URL성분을 결합");
console.debug(urlString);
console.groupEnd();