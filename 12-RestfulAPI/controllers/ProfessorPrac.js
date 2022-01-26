// department 테이블에 대한 CRUD 기능을 수행하는 Restful API

// 모듈 참조부분
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");
const regexHelper = require("../../helper/RegexHelper");
const util = require("../../helper/UtilHelper");
// 라우팅 정의 부분
module.exports = (app) => {
  let dbcon = null;

  // 전체 목록 조회 --> Read(SELECT)
  router.get("/professorPrac", async (req, res, next) => {
    // 검색어 파라미터 받기 -> 검색어가 없을 경우 전체 목록 조회이므로 유효성 검사 안함
    const query = req.get("query");

    // 현재 페이지 번호 받기(기본값은 1)
    const page = req.get("page", 1);

    // 한 페이지에 보여질 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
    const rows = req.get("rows", 10);

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    let pagenation = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      let sql1 = "SELECT COUNT(*) AS cnt FROM professor";

      // SQL문에 설정할 치환값
      let args1 = [];

      if (query != null) {
        sql1 += " WHERE name LIKE concat('%', ?, '%')";
        args1.push(query);
      }
      const [result1] = await dbcon.query(sql1, args1);
      console.log([result1]);
      const totalCount = result1[0].cnt;

      // 페이지번호 정보를 계산한다.
      pagenation = util.pagenation(totalCount, page, rows);
      logger.debug(JSON.stringify(pagenation));

      // 데이터 조회
      let sql2 =
        "SELECT p.profno, name, userid, position, sal, hiredate, d.deptno, dname FROM professor p INNER JOIN department d ON p.deptno = d.deptno";

      // SQL문에 설정할 치환값
      let args2 = [];

      if (query != null) {
        sql2 += " WHERE name LIKE concat('%', ?, '%')";
        args2.push(query);
      }
      sql2 += " LIMIT ?, ?";
      args2.push(pagenation.offset);
      args2.push(pagenation.listCount);

      const [result2] = await dbcon.query(sql2, args2);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.sendJson({ pagenation: pagenation, item: json });
  });

  // 특정 항목에 대한 상세 조회
  router.get("/professorPrac/:profno", async (req, res, next) => {
    const profno = req.get("profno");

    if (profno == null) {
      // 400 Bad Request -> 잘못된 요청
      return next(new Error(400));
    }

    try {
      regexHelper.value(profno, "값이 없습니다.");
      regexHelper.maxLength(profno, 10, "교수번호가 너무 깁니다.");
      regexHelper.num(profno, "숫자형식이어야 합니다.");
    } catch (err) {
      return next(err);
    }

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터 베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql =
        "SELECT p.profno, name, userid, position, sal, hiredate, d.deptno, dname FROM professor p INNER JOIN department d ON p.deptno = d.deptno WHERE profno = ?";
      const [result] = await dbcon.query(sql, [profno]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ item: json });
  });

  //   데이터 추가 --> Create(INSERT)
  router.post("/professorPrac", async (req, res, next) => {
    //   저장을 위한 파라미터 입력받기
    const name = req.post("name");
    const userid = req.post("userid");
    const position = req.post("position");
    const sal = req.post("sal");
    const hiredate = req.post("hiredate");
    const comm = req.post("comm");
    const deptno = req.post("deptno");

    try {
      regexHelper.value(name, "이름이 없습니다.");
      regexHelper.value(userid, "아이디가 없습니다.");
      regexHelper.value(position, "직급이 없습니다.");
      regexHelper.value(sal, "급여가 없습니다.");
      regexHelper.value(hiredate, "입사일이 없습니다.");
      regexHelper.value(comm, "보직수당이 없습니다.");
      regexHelper.value(deptno, "학과번호가 없습니다.");

      regexHelper.maxLength(name, 50, "이름이 너무 깁니다.");
      regexHelper.maxLength(userid, 50, "아이디가 너무 깁니다.");
      regexHelper.maxLength(position, 20, "직급이 너무 깁니다.");
      regexHelper.maxLength(sal, 10, "급여가 맞지 않습니다");
      regexHelper.maxLength(hiredate, 20, "입사일이 너무 깁니다.");
      regexHelper.maxLength(comm, "보직수당에 맞지 않습니다.");
      regexHelper.maxLength(deptno, "학과번호가 깁니다.");

      regexHelper.num(sal, "숫자형식이어야 합니다.");
      regexHelper.num(deptno, "숫자형식이어야 합니다.");

      regexHelper.kor(name, "한글이어야 합니다.");
      regexHelper.kor(position, "직급은 한글이어야 합니다.");

      regexHelper.engNum(userid, "아이디형식이 아닙니다.");
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
        "INSERT INTO professor (name, userid, position, sal, hiredate, comm, deptno) VALUES (?,?,?,?,?,?,?)";

      const input_data = [name, userid, position, sal, hiredate, comm, deptno];
      logger.debug(input_data);
      const [result1] = await dbcon.query(sql, input_data);
      logger.debug([result1]);

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 =
        "SELECT name, userid, position, sal, hiredate, comm, deptno FROM professor WHERE profno = ?";
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

  //   데이터 수정 --> UPDATE
  router.put("/professorPrac/:profno", async (req, res, next) => {
    const profno = req.get("profno");
    const name = req.post("name");
    const userid = req.post("userid");
    const position = req.post("position");
    const sal = req.post("sal");
    const hiredate = req.post("hiredate");
    const comm = req.post("comm");
    const deptno = req.post("deptno");

    if (profno == null) {
      // 400 Bad Request -> 잘못된 요청
      return next(new Error(400));
    }

    try {
      regexHelper.value(name, "이름이 없습니다.");
      regexHelper.value(userid, "아이디가 없습니다.");
      regexHelper.value(position, "직급이 없습니다.");
      regexHelper.value(sal, "급여가 없습니다.");
      regexHelper.value(hiredate, "입사일이 없습니다.");
      regexHelper.value(comm, "보직수당이 없습니다.");
      regexHelper.value(deptno, "학과번호가 없습니다.");

      regexHelper.maxLength(name, 50, "이름이 너무 깁니다.");
      regexHelper.maxLength(userid, 50, "아이디가 너무 깁니다.");
      regexHelper.maxLength(position, 20, "직급이 너무 깁니다.");
      regexHelper.maxLength(sal, 10, "급여가 맞지 않습니다");
      regexHelper.maxLength(hiredate, 20, "입사일이 너무 깁니다.");
      regexHelper.maxLength(comm, "보직수당에 맞지 않습니다.");
      regexHelper.maxLength(deptno, "학과번호가 깁니다.");

      regexHelper.num(sal, "숫자형식이어야 합니다.");
      regexHelper.num(deptno, "숫자형식이어야 합니다.");

      regexHelper.kor(name, "한글이어야 합니다.");
      regexHelper.kor(position, "직급은 한글이어야 합니다.");

      regexHelper.engNum(userid, "아이디형식이 아닙니다.");
    } catch (err) {
      return next(err);
    }

    // 데이터 수정하기
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 수정하기
      const sql =
        "UPDATE professor SET name = ?, userid = ?, position = ?, sal = ?, hiredate =?, comm =?, deptno =? WHERE profno=?";
      const input_data = [
        name,
        userid,
        position,
        sal,
        hiredate,
        comm,
        deptno,
        profno,
      ];
      const [result1] = await dbcon.query(sql, input_data);

      //   결과 행 수가 0이라면 예외처리
      if (result1.affectedRows < 1) {
        throw new Error("수정된 데이터가 없습니다.");
      }

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 =
        "SELECT name, userid, position, sal, hiredate, comm, deptno FROM professor WHERE profno = ?";
      const [result2] = await dbcon.query(sql2, [profno]);

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

  //   데이터 삭제 --> DELETE
  router.delete("/professorPrac/:profno", async (req, res, next) => {
    const profno = req.get("profno");

    if (profno === undefined) {
      //400 Bad Request -> 잘못된 요청
      return next(new Error(400));
    }

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
      // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야한다.
      // 단, 자식 데이터는 결과 행 수가 0이더라도 무시한다.

      await dbcon.query(
        "ALTER TABLE `student` CHANGE `profno` `profno` INT(11) NULL;"
      );
      await dbcon.query("UPDATE student SET profno = null WHERE profno = ?", [
        profno,
      ]);

      //데이터 삭제하기
      const sql = "DELETE FROM professor WHERE profno=?";
      const [result1] = await dbcon.query(sql, [profno]);
      logger.debug([result1]);
      if (result1.affectedRows < 1) {
        throw new Error("삭제된 데이터가 없습니다.");
      }
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson();
  });
  return router;
};
