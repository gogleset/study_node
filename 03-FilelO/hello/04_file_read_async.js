const fs = require('fs');
const target = './output_async.txt';

if(fs.existsSync(target)){
    // 비동기식으로 파일 읽기
    // 파일을 다 읽을 때까지 대기하지 않고 프로그램은 다음으로 진행
    //--> 파일 읽기가 종료되면 세번째 파라미터인 콜백함수가 호출된다.
    fs.readFile(target, 'utf8', (err,data) => {
        if(err){
            console.error(err);
            return;
        }

        console.debug(data); //읽어들인 데이터 출력
    })
    console.debug(target + '파일을 읽도록 요청했습니다.');
} else{
    console.debug(target +'파일이 존재하지 않습니다.');
}