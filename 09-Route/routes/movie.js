module.exports = (app) => {
  const fileHelper = require("../../helper/FileHelper");
  const config = require("../../helper/_config");
  const logger = require("../../helper/LogHelper");
  const router = require("express").Router();
  const axios = require("axios");
  const fs = require("fs"); // FileSystem 모듈 참조
  const target = "_files/movie/movie.txt"; //저장할 파일의 경로()
  let content = null; //저장할 내용
  

  router
    .route("/movie")
    .get((req, res, next) => {
      let fs = require("fs"); //FileSystem 모듈 참조
      let response = null;
      let responseNum = null;

      if (fs.existsSync(target)) {
        //파일을 동기식으로 읽어서 그 내용을 리턴한다.
        //이 파일을 다 읽기 전까지는 프로그램이 대기상태임.
        // 그러므로 대용량 처리에는 적합하지 않음
        let data = fs.readFileSync(target, "utf8");
        response = data
        // 읽어들인 데이터를 출력
        logger.debug(response);

        responseNum = 200;
      } else {
        logger.debug(target + "파일이 존재하지 않습니다.");
      }

      res.status(responseNum).send(response);
    })
    .post((req, res, next) => {
      // <form>상에 수정 상품정보를 입력 후 전송한다(주로 관리자 기능)
      // 저장시에는 일련번호는 정송하지 않으며 저장후 자동으로 발급되는 일련번호를 프론트에게 돌려줘야 한다.
      for (key in req.body) {
        const str =
          "프론트엔드로부터 전달받은 변수 ::: " + key + "=" + req.body[key];
        logger.debug(str);
      }
      const isExists = fs.existsSync(target); //파일의 존재 여부 검사(true, false 리턴)

      const movie = async () => {
        let response = null;
        let date = req.body.date;

        let msg = null;

        logger.debug(date);
        try {
          let json = await axios.get(
            "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=d145fd2512b2f9be50d440aedfa4b898&targetDt=" +
              date
          );
          response = json.data.boxOfficeResult.dailyBoxOfficeList;
        } catch (e) {
          console.log(e);
        }

        fileHelper.mkdir(config.movie.dir);

        content += JSON.stringify(response);
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
          msg = "<h1>데이터 저장 및 파일 쓰기 완료</h1>";
        } 
        else {
          // 3) 파일이 존재할 경우 파일 삭제
          fs.unlinkSync(target);
          console.log(target + "파일삭제완료");
          fs.writeFileSync(target, content, "utf8");

          // 퍼미션 설정
          fs.chmodSync(target, 0766);
          msg = "<h1>데이터 저장 및 파일 다시쓰기 완료</h1>";
        }
        console.log(msg);
        res.status(200).send(msg);
      };

      movie();
    })
    .put((req, res, next) => {})
    .delete((req, res, next) => {
      let response = null;
      const isExists = fs.existsSync(target); //파일의 존재 여부 검사(true, false 리턴)

      if (isExists){
          // 3) 파일이 존재할 경우 파일 삭제
          fs.unlinkSync(target);
          logger.debug(target + "파일삭제완료")
          response = "<h1>파일삭제완료</h1>"

          res.status(200).send(response);
      } else {
        response = "<h1>파일이 없습니다</h1>"
        res.status(200).send(response)
      }
    });

  return router;
};
