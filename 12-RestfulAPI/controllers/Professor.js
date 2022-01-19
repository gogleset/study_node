// department 테이블에 대한 CRUD 기능을 수행하는 Restful API

// 모듈 참조부분
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");

// 라우팅 정의 부분
module.exports = (app) => {
  let dbcon = null;

  // 전체 목록 조회 --> Read(SELECT)
  router.get("/professor", async (req, res, next) => {
    // 데이터 조회 결과가 저장될 빈 변수

    let json = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql = "SELECT * FROM professor";
      const [result] = await dbcon.query(sql);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.sendJson({ item: json });
  });

  // 특정 항목에 대한 상세 조회
  router.get("/professor/:profno", async (req, res, next) => {
    const profno = req.get("profno");

    if (profno == null) {
      // 400 Bad Request -> 잘못된 요청
      return next(new Error(400));
    }

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터 베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql = "SELECT * FROM professor WHERE profno=?";
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
  router.post("/professor", async (req, res, next) => {
    //   저장을 위한 파라미터 입력받기
    const name = req.post("name");
    const userid = req.post("userid");
    const position = req.post("position");
    const sal = req.post("sal");
    const hiredate = req.post("hiredate");
    const comm = req.post("comm");
    const deptno = req.post("deptno");

    if (name === null || userid === null) {
      // 400 Bad Request -> 잘못된 요청
      return next(new Error(400));
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
      const sql2 = "SELECT * FROM student WHERE profno=?";
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
  router.put("/professor/:profno", async (req, res, next) => {
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
      const sql2 = "SELECT * FROM professor WHERE profno=?";
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
  router.delete("/professor/:profno", async (req, res, next) => {
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
      //   단, 자식 데이터는 결과 행 수가 0이더라도 무시한다.

      await dbcon.query("DELETE FROM student WHERE profno=?", [profno]);

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
