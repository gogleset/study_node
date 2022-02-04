// 모듈 참조부분
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../../helper/RegexHelper");
const MultipartException = require("../../exceptions/MultipartException");
const BadRequestException = require("../../exceptions/BadRequestException");
const utilHelper = require("../../helper/UtilHelper");
const multer = require("multer");

module.exports = (app) => {
  let dbcon = null;

  /**
   * 회원가입
   * [POST] /member/join
   */
  router.post("/member/join", async (req, res, next) => {
    
    // webhelper에 추가된 기능을 활용하여 업로드 객체 반환받기
    const multipart = req.getMultipart();
    logger.debug("접속");
    // 업로드 수정하기
    const upload = multipart.single("profile_img");

    // 업로드 처리 후 텍스트 파라미터 받기
    upload(req, res, async (err) => {
      
      // 업로드 에러 처리
      if (err) {
        throw new MultipartException(err);
      }

      // 업로드 된 파일의 정보를 로그로 기록(필요에 따른 선택사항)
      logger.debug(JSON.stringify(req.file));

      //   저장을 위한 파라미터 입력받기
      const user_id = req.post("user_id");
      const user_pw = req.post("user_pw");
      const user_name = req.post("user_name");
      const email = req.post("email");
      const phone = req.post("phone");
      const birthday = req.post("birthday");
      const gender = req.post("gender");
      const postcode = req.post("postcode");
      const addr1 = req.post("addr1");
      const addr2 = req.post("addr2");
      const photo = req.file.url;

      // 유효성 검사
      try {
        regexHelper.value(user_id, "아이디 값이 없습니다.");
        regexHelper.value(user_pw, "비밀번호 값이 없습니다.");
        regexHelper.value(user_name, "이름 값이 없습니다.");
        regexHelper.value(email, "이메일 값이 없습니다.");
        regexHelper.value(birthday, "생년월일 값이 없습니다.");
        regexHelper.value(gender, "성별 값이 없습니다.");
        regexHelper.value(phone, "핸드폰 번호 값이 없습니다.");

        regexHelper.maxLength(user_id, 30, "아이디가 너무 깁니다.");
        regexHelper.maxLength(user_pw, 255, "비밀번호가 너무 깁니다.");
        regexHelper.maxLength(user_name, 20, "이름이 너무 깁니다.");
        regexHelper.maxLength(email, 150, "이메일 형식이 너무 깁니다.");
        regexHelper.maxLength(addr1, 20, "국가번호가 너무 깁니다.");
        regexHelper.maxLength(phone, 11, "전화번호가 너무 깁니다.");

        regexHelper.num(
          phone,
          "전화번호가 숫자가 아닌 형식이 들어가 있습니다."
        );
        regexHelper.num(postcode, "우편번호 값이 없습니다.");
      } catch (err) {
        return next(err);
      }

      try {
        // 데이터 베이스접속
        dbcon = await mysql2.createConnection(config.database);
        await dbcon.connect();

        let sql1 = "SELECT COUNT(*) AS cnt FROM members WHERE user_id=?";
        let args1 = [user_id];

        const [result1] = await dbcon.query(sql1, args1);
        const totalCount = result1[0].cnt;

        if (totalCount > 0) {
          throw new BadRequestException("이미 사용중인 아이디입니다.");
        }

        // 데이터 저장하기
        let sql2 = "INSERT INTO `members` (";
        sql2 +=
          "user_id, user_pw, user_name, email, phone, birthday, gender, postcode, addr1, addr2, photo, ";
        sql2 += "is_out, is_admin, login_date, reg_date, edit_date";
        sql2 += ") VALUES (";
        sql2 +=
          "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'N', 'N', null, now(), now());";

        const args2 = [
          user_id,
          user_pw,
          user_name,
          email,
          phone,
          birthday,
          gender,
          postcode,
          addr1,
          addr2,
          photo,
        ];
        await dbcon.query(sql2, args2);
      } catch (e) {
        return next(e);
      } finally {
        dbcon.end();
      }
      // 모든 구현에 성공했다면 가입 환영 메일 구성
      const receiver = `${user_name} <${email}>`;
      const subject = `${user_name}님의 회원가입을 환영합니다.`;
      const html = `<p><strong>${user_name}</strong>님, 회원가입해 주셔서 갑사합니다.</p><p>앞으로 많은 이용 부탁드립니다.</p>`;

      try {
        res.sendMail(receiver, subject, html);
      } catch (e) {
        throw new RuntimeException(
          "회원가입은 완료 되었지만 가입 환영 메일 발송에 실패했습니다."
        );
      }
      res.sendJson();
    });
  });
  /**
   * 아이디 중복 검사
   * [POST] /member/id_unique_check
   */
  router.post("/member/id_unique_check", async (req, res, next) => {
    // 파라미터 받기
    // 중복검사는 갯수세는게 중요하다
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
        "SELECT id, user_id, user_pw, user_user_name, email, phone, birthday, gender, postcode, addr1, addr2, photo, is_out, is_admin, login_date, reg_date, edit_date FROM members WHERE user_id =? AND user_pw = ?";
      let args1 = [user_id, user_pw];

      const [result] = await dbcon.query(sql, args1);

      // 조회된 회원정보 객체를 저장하고 있는 1차원 배열(원소는 1개)
      json = result;

      // login_date값을 now()로 update 처리(json데이터는 result가 가져가는게 맞다.)
      let sql2 = "UPDATE members SET login_date=now() WHERE id=?";
      dbcon.query(sql2, json[0].id);
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

    // 조회 결과를 DB 세션에 저장
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
