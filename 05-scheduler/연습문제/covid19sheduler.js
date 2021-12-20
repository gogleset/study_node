const axios = require("axios");
const fileHelper = require("../../helper/FileHelper");
const timer = require("node-schedule");
const url = "http://itpaper.co.kr/demo/covid19/now.php";
const fs = require("fs"); // FileSystem 모듈 참조
const target = "./output_corona.txt"; //저장할 파일의 경로()
let content = null; //저장할 내용
const isExists = fs.existsSync(target); //파일의 존재 여부 검사(true, false 리턴)

const de = async () => {
  let json = null;
  try {
    json = await axios.get(url);
  } catch (e) {
    console.log(e);
  }
  content += JSON.stringify(json.data);
  console.log(content);
  if (!isExists) {
    /**
     * 2)파일이 존재하지 않을 경우 새로 저장
     * 저장할 경로는 상대, 절대 경로 모두 가능
     * 상대경로인 경우 vscode에 설정된 작업 디렉토리가 기준
     * 절대경로인 경우 컴퓨터 전역에 대해서 지정가능 -> ex) c:/hello/world, c:\\hello\\world
     * 여기서는 상대경로 지정, 동기식 파일저장.
     * 이 파일을 다 저장하기 전까지는 프로그램이 대기상태임
     * 그러므로 대용량 처리에는 적합하지 않음
     */
    fs.writeFileSync(target, content, "utf8");

    // 퍼미션 설정
    fs.chmodSync(target, 0766);

    // 파일저장이 완료된 후에나 메시지가 표시된다.
    console.log(target + "파일에 데이터쓰기 및 퍼미션 설정 완료.");
  } else {
    // 3) 파일이 존재할 경우 파일 삭제
    fs.unlinkSync(target);
    console.log(target + "파일삭제완료");
    fs.writeFileSync(target, content, "utf8");

    // 퍼미션 설정
    fs.chmodSync(target, 0766);
  }
};


const time = new timer.RecurrenceRule();
// time.second = 30;
timer.scheduleJob("* * * * *", () => de());
timer.scheduleJob("*/2 * * * *", () => {
  content = null;
})
