let fs = require('fs');
let target = './docs';

if(!fs.existsSync(target)){
    (async() => {
        try{
            // await는 비동기 방식으로 데이터를 가져오고, 동기방식으로 동작 즉 첫번째 await 가 끝나면 두번째가 동기적으로 실행됨
            await fs.promises.mkdir(target);
            await fs.promises.chmod(target,0777);
            console.debug("디렉토리 생성 완료");
        } catch(e){
            console.error("디렉토리 생성 에러");
            console.error(e);
        }
    })();

    console.log('%s 폴더의 생성을 요청했습니다.',target);
} else{
    (async() => {
        try{
            await fs.promises.rmdir(target);
            console.debug("디렉토리 삭제 완료");
        } catch (e){
            consoe.error("디렉토리 삭제 에러");
            console.error(e);
        }
    })();
    console.log('%s 폴더의 삭제를 요청했습니다', target);
}