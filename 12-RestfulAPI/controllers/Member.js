// 모듈 참조부분
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../../helper/RegexHelper");

module.exports = (app) => {

    router.post("/member", async (req, res, next) => {
    //   저장을 위한 파라미터 입력받기
    const userid = req.post("userid");
    const password = req.post("password");
    const name = req.post("name");
    const birthdate = req.post("birthdate");
    const gender = req.post("gender");
    const email = req.post("email");
    const countrynum = req.post("countrynum");
    const tel = req.post("tel");
    const reg_date = req.post("reg_date");

    try{
        regexHelper.value(userid,'아이디 값이 없습니다.');
        regexHelper.value(password,'비밀번호 값이 없습니다.');
        regexHelper.value(name,'이름 값이 없습니다.');
        regexHelper.value(birthdate,'생년월일 값이 없습니다.');
        regexHelper.value(gender,'성별 값이 없습니다.');
        regexHelper.value(email,'이메일 값이 없습니다.');
        regexHelper.value(countrynum,'국가번호 값이 없습니다.');
        regexHelper.value(tel,'전화번호 값이 없습니다.');


        regexHelper.maxLength(userid, 30,  '아이디가 너무 깁니다.');
        regexHelper.maxLength(password, 255,  '비밀번호가 너무 깁니다.');
        regexHelper.maxLength(name, 20,  '이름이 너무 깁니다.');
        regexHelper.maxLength(email, 150,  '이메일 형식이 너무 깁니다.');
        regexHelper.maxLength(countrynum, 4,  '국가번호가 너무 깁니다.');
        regexHelper.maxLength(tel, 11,  '전화번호가 너무 깁니다.');


        regexHelper.num(tel, '전화번호가 숫자가 아닌 형식이 들어가 있습니다.');
        regexHelper.num(countrynum,'국가번호 값이 없습니다.');


      }catch(err){
        return next(err);
      }

    // 데이터 저장하기
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 저장하기
      const sql =
        "INSERT INTO members (userid, password, name, birthdate, gender, email, countrynum, tel) VALUES (?,?,?,?,?,?,?,?)";

      const input_data = [userid, password, name, birthdate, gender, email, countrynum, tel];
      logger.debug(input_data);
      const [result1] = await dbcon.query(sql, input_data);
      logger.debug([result1]);

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT * FROM members WHERE id=?";
      logger.debug([result1.insertId]);
      const [result2] = await dbcon.query(sql2, [result1.insertId]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ item: json });
  }); 
  return router;
}
