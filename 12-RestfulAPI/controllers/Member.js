// 모듈 참조부분
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../../helper/RegexHelper");
const BadRequestException = require("../../exceptions/BadRequestException");
const utilHelper = require("../../helper/UtilHelper");

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

    try {
      regexHelper.value(userid, "아이디 값이 없습니다.");
      regexHelper.value(password, "비밀번호 값이 없습니다.");
      regexHelper.value(name, "이름 값이 없습니다.");
      regexHelper.value(birthdate, "생년월일 값이 없습니다.");
      regexHelper.value(gender, "성별 값이 없습니다.");
      regexHelper.value(email, "이메일 값이 없습니다.");
      regexHelper.value(countrynum, "국가번호 값이 없습니다.");
      regexHelper.value(tel, "전화번호 값이 없습니다.");

      regexHelper.maxLength(userid, 30, "아이디가 너무 깁니다.");
      regexHelper.maxLength(password, 255, "비밀번호가 너무 깁니다.");
      regexHelper.maxLength(name, 20, "이름이 너무 깁니다.");
      regexHelper.maxLength(email, 150, "이메일 형식이 너무 깁니다.");
      regexHelper.maxLength(countrynum, 4, "국가번호가 너무 깁니다.");
      regexHelper.maxLength(tel, 11, "전화번호가 너무 깁니다.");

      regexHelper.num(tel, "전화번호가 숫자가 아닌 형식이 들어가 있습니다.");
      regexHelper.num(countrynum, "국가번호 값이 없습니다.");
    } catch (err) {
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

      const input_data = [
        userid,
        password,
        name,
        birthdate,
        gender,
        email,
        countrynum,
        tel,
      ];
      logger.debug(input_data);
      const [result1] = await dbcon.query(sql, input_data);
      logger.debug([result1]);

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT userid, password, name, bithdate, gender, email, countrynum, tel FROM members WHERE id=?";
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
  /**
   * 아이디 중복 검사
   * [POST] /member/id_unique_check
   */
  router.post("/member/id_unique_check", async (req, res, next) => {
    // 파라미터 받기

    const user_id = req.post("user_id");

    // 유효성검사
    try {
      regexHelper.value(user_id, "아이디를 입력하세요");
    } catch (e) {
      return next(e);
    }

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 전체 데이터 수를 조회
      let sql = "SELECT COUNT(*) AS cnt FROM members WHERE user_id = ?";
      let args = [user_id];

      const [result] = await dbcon.query(sql, args);
      const totalCount = result[0].cnt;

      if (totalCount > 0) {
        throw new BadRequestException("이미 사용중인 아이디입니다.");
      }
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }

    res.sendJson();
  });

  /**
   * 로그인
   * 원래 로그인은 조회에 해당하므로 GET방식 접속이어야 하지만,
   * 아이디와 비밀번호가 URL로 노출되는 것은 보안에 좋지 않으므로 POST 방식으로 처리
   * [POST] /member/login
   */
  router.post("/member/login", async (req, res, next) => {
    // 파라미터 받기
    const user_id = req.post("user_id");
    const user_pw = req.post("user_pw");

    try {
      // 아이디와 비밀번호를 유추하는데 힌트가 될 수 있으므로
      // 유효성 검사는 입력 여부만 확인한다.
      regexHelper.value(user_id, "아이디를 입력하세요");
      regexHelper.value(user_pw, "비밀번호를 입력하세요");
    } catch (e) {
      return next(e);
    }

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 아이디와 비번이 일치하는 데이터를 조회 (조회결과에서 비밀번호는 제외)
      let sql =
        "SELECT id, user_id, user_pw, user_name, email, phone, birthday, gender, postcode, addr1, addr2, photo, is_out, is_admin, login_date, reg_date, edit_date FROM members WHERE user_id =? AND user_pw = ?";
      let args1 = [user_id, user_pw];

      const [result] = await dbcon.query(sql, args1);

      // 조회된 회원정보 객체를 저장하고 있는 1차원 배열(원소는 1개)

      json = result;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }

    // 조회된 데이터가 없다면? WHERE 절이 맞지 않다는 의미 -> 아이디, 비번 틀림
    if (json == null || json.length == 0) {
      return next(
        new BadRequestException("아이디나 비밀번호가 잘못되었습니다.")
      );
    }
    // 탈퇴한 회원은 로그인 금지
    if (json[0].is_out == "Y") {
      return next(new BadRequestException("탈퇴한 회원입니다."));
    }

    // 조회 결과를 세션에 저장
    req.session.memberInfo = json[0];

    res.sendJson();
  });

  /**
   * 로그인 정보확인
   * [GET] /member/info
   */
  router.get("/member/info", async (req, res, next) => {
    if (!req.session.memberInfo) {
      return next(new BadRequestException("로그인 중이 아닙니다."));
    }

    res.sendJson({ item: req.session.memberInfo });
  });


  /**
   * 로그아웃
   * [DELETE] /member/logout
   */
  router.delete("/member/logout", async (req, res, next) => {
    // 세션이 있는지 검사
    if (!req.session.memberInfo) {
      return next(new BadRequestException("로그인 중이 아닙니다."));
    }
    try {
      await req.session.destroy();
    } catch (e) {
      return next(e);
    }

    res.sendJson();
  });

  /**
   * 회원정보 수정
   * 회원과 관련된 처리의 경우 UPDATE나 DELETE에서 사용할 WHERE절의 PK값을
   * 보안상의 이유로 별도 전송하지 않는다.
   * 로그인을 할 경우 회원의 정보가 SESSION에 저장되어 있을 것이므로
   * 모든 개별 회원에 대한 접근은 SESSION 데이터를 활용해야 한다.
   * [PUT] /member/edit
   */
  router.put("/member/edit", async (req, res, next) => {
    if (!req.session.memberInfo) {
      return next(new BadRequestException("로그인 중이 아닙니다."));
    }
  });

  /**
   * 회원탈퇴
   * 탈퇴 처리가 회원데이터를 삭제하는 것을 의미하므로 DELETE 방식의 접근이 맞지만,
   * 실제 비지니스 로직에서는 회원 데이터를 즉시 삭제하는 것이 아니라 탈퇴 여부를 의미하는
   * 컬럼의 값을 UPDATE하는 것으로 처리 (실제 SQL 문은 UPDATE)
   * 별도의 batch 프로그램으로 탈퇴 여부를 의미하는 컬럼(is_out)의 값이 Y이고
   * 데이터가 변경된 시기가 3개월 전인지를 검사하여 일괄 삭제한다.
   * [DELETE] /member/out
   */
  router.delete("/member/out", async (req, res, next) => {
    if (!req.session.memberInfo) {
      return next(new BadRequestException("로그인 중이 아닙니다."));
    }

    // 데이터베이스 접속
    try {
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 아이디와 비번이 일치하는 데이터를 조회 (조회결과에서 비밀번호는 제외)
      let sql = "UPDATE members SET is_out = 'Y', edit_date=now() WHERE id=?";
      let args = [req.session.memberInfo.id];

      const [result] = await dbcon.query(sql, args);

      if (result.affectedRows < 1) {
        throw new Error("탈퇴처리에 실패했습니다.");
      }

      // 강제로그아웃(세션삭제)
      await req.session.destroy();
      json = result;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }

    res.sendJson();
  });
  return router;
};
