/**
 * 1) 모듈참조, 필요한 변수 생성
 */

const fs = require('fs'); // FileSystem 모듈 참조
const target = './output_async.txt'; //저장할 파일의 경로()
const content = 'Hello World'; //저장할 내용
const isExists = fs.existsSync(target);//파일의 존재 여부 검사

if(!isExists){
    /**
     * 2) 파일이 존재하지 않을 경우 새로 저장
     */

    // 절대경로 지정, 비동기식 파일저장
    fs.writeFile(target, content,'utf8', (err) => {
        if(err){
            console.error(err);
            return;
        }

        console.debug(target+'에 데이터 쓰기 완료.');

        // 퍼미션 설정 (파일권한설정)
        fs.chmod(target, 0766, (err) => {
            if (err){
                console.error(err);
                return;
            }

            console.debug(target+'의 퍼미션 설정 완료');
        });

        console.debug(target+'의 퍼미션 설정을 요청했습니다.');
    });

    console.debug(target+'의 파일 저장을 요청했습니다.')
} else {
    //3) 파일이 존재할 경우 파일 삭제
    fs.unlink(target, (err) => {
        if(err){
            console.error(err);
            return;
        }

        console.debug(target+'의 파일 삭제완료');
    });
    console.debug(target+'의 파일 삭제를 요청했습니다.');
}