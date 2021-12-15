let fs = require('fs');
let target = './docs';


if(!fs.existsSync(target)){
    console.log(target + '경로가 존재하지 않기 때문에 생성합니다.');
    fs.mkdirSync(target); //폴더 생성하기(오래 걸리는 작업이 아니므로 동기처리)
    fs.chmodsync(target,0755);
    console.log(target + '(이)가 생성되었습니다.');
} else {
    console.log(target + '경로가 존재하므로 삭제합니다.');
    fs.rmdirSync(target); // 폴더 삭제하기 -> 비어있지 않은 폴더는 삭제할 수 없다.
    console.log(target + '(이)가 삭제되었습니다.');
}