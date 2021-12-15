let fs = require('fs'); //FileSystem 모듈 참조
let target = './output_async.txt'; //읽어들일 파일의 경로


if(fs.existsSync(target)){
    //파일을 동기식으로 읽어서 그 내용을 리턴한다.
    //이 파일을 다 읽기 전까지는 프로그램이 대기상태임.
    // 그러므로 대용량 처리에는 적합하지 않음
    let data = fs.readFileSync(target,'utf8');

    // 읽어들인 데이터를 출력
    console.log(data);
} else {
    console.log(target + "파일이 존재하지 않습니다.");
}