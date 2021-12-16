const path = require('path');


module.exports = {
    // 로그 파일이 저장될 경로 및 출력레벨
    log:{
        debug:{
            path:path.join(__dirname,'../_files/_logs'),
            level:'debug'
        }, 
        // 시스템에 심각한 문제가 발생했을떄의 정보를 저장할 파일
        error:{
            path:path.join(__dirname,'../_files/_logs'),
            level:'error'
        }
    }
}