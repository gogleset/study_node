let fileHelper = require('../../helper/FileHelper');
let path = require('path');

// 상대경로 방식으로 폴더 생성하기
// -->vscode가 열고 있는 프로젝트 폴더 기준.
let target1 = './test/dir/make';
console.log(target1);
fileHelper.mkdir(target1);


// 절대경로 방식으로 폴더 생성하기
// __dirname --> 이 소스파일이 위치하는 디렉토리의 절대경로값
let target2 = path.join(__dirname, 'hello/node/js');
console.log(target2);
fileHelper.mkdir(target2);