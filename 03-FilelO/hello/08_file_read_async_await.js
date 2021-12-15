// 1) 모듈참조,필요한 변수 생성
const fs = require('fs'); // FileSystem 모듈 참조
const target = './output_await.txt'; //읽어들일 파일의 경로()

if(fs.existsSync(target)){
    (async()=>{
        let data = null;
        // 비동기처리의 결과를 then()함수에 대한 콜백 파라미터로 전달받아야 하는 경우,
        // await 키워드를 적용하면 then()함수 없이 즉시 리턴받으 수 있다.
        try{
            data = await fs.promises.readFile(target,'utf8');
            console.debug('파일읽기 완료')
        } catch (err){
            console.error(err);
            console.error('파일읽기 실패');
        }

        console.debug(data);
    })();

    console.log(target+'파일을 읽도록 요청했습니다');
}else{
    console.log(target+'파일이 존재하지 않습니다.');
}