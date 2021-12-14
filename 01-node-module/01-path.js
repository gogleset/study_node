/**
 * 1) 모듈 참조
 * React에서는 import 구문으로 변경됨(참고)
 * 참조 가능한 모듈은 내 컴퓨터에 설치된 Node.js 기본모듈, npm명령으로 설치한 오픈소스 모듈, 내가 작성한 코드
 * 직접 작성한 코드를 참조할 경우 "./", "../" 등을 반드시 적용해야함.
 * 모듈 이름 앞에 "./" 등의 경로 표시가 없는 경우 기본모듈 혹은 npm 명령으로 설치한 모듈로 인식하고
 * 모듈 저장소를 탐색함. --> 사용자홈디렉토리/node_modules, 프로젝트위치/node_modules
 */

// 보관할 폴더를 결정할때(?) 많이 씀

const path = require('path');



/**
 * 2) 경로 합치기
 * -파라미터의 제한이 없다
 * -조합된 경로 문자열에 해당하는 Path가 실제로 존재하는지는 상관 없다.
 */

// path.join은 파일 경로를 입력한다.
const currentPath = path.join('/Users/hello.world', 'myphoto', '../photo.jpg');
console.group('path.join');
console.debug(currentPath);

console.groupEnd();

// 3) 경로에서 디렉토리, 파일명, 확장자 구분하기

// 경로를 입력한 변수에 path.dirname을 입력하면 파일 경로와 파일이름을 가지고온다
const dirname = path.dirname(currentPath);
// 경로를 입력한 변수에 path.basename을 입력하면 파일이름만 가지고온다
const basename = path.basename(currentPath);
// 경로를 입력한 변수에 path.extname을 입력하면 파일 확장자만 가지고온다
const extname = path.extname(currentPath);
console.group('경로 분할하기');
console.debug('디렉토리: %s', dirname);
console.debug('파일 이름 : %s', basename);
console.debug('확장자 : %s', extname);
console.groupEnd();

/**
 * 4) 경로정보 파싱
 * 경로의 성분을 JSON 형태로 한번에 분할하기
 */

const parse = path.parse(currentPath);
console.group('경로정보 파싱');
// parse엔 모든 파일의 정보가 담겨있음
console.debug("%o", parse);

// parse.으로 객체에 접근가능
console.debug("root: " + parse.root);
console.debug("dir: " + parse.dir);
console.debug("name: " + parse.name);
console.debug("ext: " + parse.ext);
console.groupEnd();
