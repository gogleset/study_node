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
  router.get("/department", async (req, res, next) => {
    // 데이터 조회 결과가 저장될 빈 변수

    let json = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql = "SELECT deptno, dname, loc FROM department";
      const [result] = await dbcon.query(sql);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result;
    } catch (e) {
      dbcon.end();
      logger.error(e);

      // 400 Bad Request => 잘못된 요청
      return res.status(500).send({
        rt: 500,
        rtmsg: "요청을 처리하는데 실패했습니다.",
        pubdate: new Date().toISOString(),
      });
    }

    dbcon.end();

    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.status(200).send({
      rt: 200,
      rtmsg: "OK",
      item: json,
      pubdate: new Date().toISOString(),
    });
  });

  // 특정 항목에 대한 상세 조회
  router.get("/department/:deptno", async (req, res, next) => {
    const deptno = req.params.deptno;

    if (deptno === undefined) {
      // 400 Bad Request -> 잘못된 요청
      return res.status(400).send({
        rt: 400,
        rtmsg: "필수 파라미터가 없습니다.",
      });
    }

    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터 베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql = "SELECT deptno, dname, loc FROM department WHERE deptno=?";
      const [result] = await dbcon.query(sql, [deptno]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result;
    } catch (e) {
      dbcon.end();
      logger.error(e);

      // 400 Bad Request -> 잘못된 요청
      return res.status(500).send({
        rt: 500,
        rtmsg: "요청을 처리하는데 실패했습니다.",
        pubdate: new Date().toISOString(),
      });
    }
    dbcon.end();

    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.status(200).send({
      rt: 200,
      rtmsg: "OK",
      item: json,
      pubdate: new Date().toISOString(),
    });
  });
  //   데이터 추가 --> Create(INSERT)
  router.post("/department", async (req, res, next) => {
    //   저장을 위한 파라미터 입력받기
    const dname = req.body.dname;
    const loc = req.body.loc;

    if (dname === undefined || loc === undefined) {
      // 400 Bad Request -> 잘못된 요청
      return res.status(400).send({
        rt: 500,
        rtmsg: "필수 파라미터가 없습니다..",
      });
    }

    // 데이터 저장하기
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 저장하기
      const sql = "INSERT INTO department (dname, loc) VALUES (?,?)";
      const input_data = [dname, loc];
      const [result1] = await dbcon.query(sql, input_data);

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT deptno, dname, loc FROM department WHERE deptno=?";
      const [result2] = await dbcon.query(sql2, [result1.insertId]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      dbcon.end();
      logger.error(e);

      // 500 server Error => 잘못된 요청
      return res.status(500).send({
        rt: 500,
        rtmsg: "요청을 처리하는데 실패했습니다.",
        pubdate: new Date().toISOString(),
      });
    }
    dbcon.end();

    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.status(200).send({
      rt: 200,
      rtmsg: "OK",
      item: json,
      pubdate: new Date().toISOString(),
    });
  });

  //   데이터 수정 --> UPDATE
  router.put("/department/:deptno", async (req, res, next) => {
    const deptno = req.params.deptno;
    const dname = req.body.dname;
    const loc = req.body.loc;

    if (deptno == undefined || dname == undefined) {
      // 400 Bad Request -> 잘못된 요청
      return res.status(400).send({
        rt: 400,
        rtmsg: "필수 파라미터가 없습니다.",
      });
    }

    // 데이터 수정하기
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 수정하기
      const sql = "UPDATE department SET dname = ?, loc = ? WHERE deptno=?";
      const input_data = [dname, loc, deptno];
      const [result1] = await dbcon.query(sql, input_data);

      //   결과 행 수가 0이라면 예외처리
      if (result1.affectedRows < 1) {
        throw new Error("수정된 데이터가 없습니다.");
      }

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT deptno, dname, loc FROM department WHERE deptno=?";
      const [result2] = await dbcon.query(sql2, [deptno]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      dbcon.end();
      logger.error(e.message);

      // 500 server Error => 잘못된 요청
      return res.status(500).send({
        rt: 500,
        rtmsg: "요청을 처리하는데 실패했습니다.",
        pubdate: new Date().toISOString(),
      });
    }

    dbcon.end();

    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.status(200).send({
      rt: 200,
      rtmsg: "OK",
      item: json,
      pubdate: new Date().toISOString(),
    });
  });

  //   데이터 삭제 --> UPDATE
  router.delete("/department/:deptno", async (req, res, next) => {
    const deptno = req.params.deptno;

    if (deptno === undefined) {
      //400 Bad Request -> 잘못된 요청
      return res.status(404).send({
        rt: 400,
        rtmsg: "필수 파라미터가 없습니다.",
      });
    }

    try {
      // 데이터 베이스접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
      // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야한다.
      //   단, 자식 데이터는 결과 행 수가 0이더라도 무시한다.

      await dbcon.query("DELETE FROM student WHERE deptno=?", [deptno]);
      await dbcon.query("DELETE FROM professor WHERE deptno=?", [deptno]);

      //데이터 삭제하기
      const sql = "DELETE FROM department WHERE deptno=?";
      const [result1] = await dbcon.query(sql, [deptno]);

      if (result1.affectedRows < 1) {
        throw new Error("삭제된 데이터가 없습니다.");
      }
    } catch (e) {
      dbcon.end();
      logger.error(e.message);

      // 500 server Error => 잘못된 요청
      return res.status(500).send({
        rt: 500,
        rtmsg: "요청을 처리하는데 실패했습니다.",
        pubdate: new Date().toISOString(),
      });
    }

    dbcon.end();

    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.status(200).send({
      rt: 200,
      rtmsg: "OK",
      pubdate: new Date().toISOString(),
    });
  });
  return router;
};
