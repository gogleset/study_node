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
  router.get("/student", async (req, res, next) => {
    // 데이터 조회 결과가 저장될 빈 변수

    let json = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();

      // 데이터 조회
      const sql =
        "SELECT studno, name, userid, grade, idnum, birthdate, tel, height, weight, deptno FROM student";
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
  router.get("/student/:studno", async (req, res, next) => {
    const studno = req.get("studno");

    if (studno == null) {
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
      const sql =
        "SELECT studno, name, userid, grade, idnum, birthdate, tel, height, weight, deptno FROM student WHERE studno=?";
      const [result] = await dbcon.query(sql, [studno]);

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

  //   데이터 추가 --> Create(INSERT)
  router.post("/student", async (req, res, next) => {
    //   저장을 위한 파라미터 입력받기
    const name = req.post("name");
    const grade = req.post("grade");
    const userid = req.post("userid");
    const idnum = req.post("idnum");
    const birthdate = req.post("birthdate");
    const tel = req.post("tel");
    const height = req.post("height");
    const weight = req.post("weight");
    const deptno = req.post("deptno");
    const profno = req.post("profno");
    logger.debug(grade);

    if (name === null || grade == null) {
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
        "INSERT INTO student (name, userid, grade, idnum, birthdate, tel, height, weight, deptno) VALUES (?,?,?,?,?,?,?,?,?)";

      const input_data = [
        name,
        userid,
        grade,
        idnum,
        birthdate,
        tel,
        height,
        weight,
        deptno,
      ];
      logger.debug(input_data);
      const [result1] = await dbcon.query(sql, input_data);
      logger.debug([result1]);

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT studno FROM student WHERE studno=?";
      logger.debug([result1.insertId]);
      const [result2] = await dbcon.query(sql2, [result1.insertId]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.sendJson({ item: json });
  });

  //   데이터 수정 --> UPDATE
  router.put("/student/:studno", async (req, res, next) => {
    const studno = req.get('studno');
    const name = req.post('name');
    const grade = req.post('grade');
    const userid = req.post("userid");
    const idnum = req.post('idnum');
    const birthdate = req.post('birthdate');
    const tel = req.post('tel');
    const height = req.post('height');
    const weight = req.post('weight');
    const deptno = req.post('deptno');
    const profno = req.post('profno');

    if (studno == null) {
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
        "UPDATE student SET name = ?, userid = ?, grade = ?, idnum = ?, birthdate =?, tel =?, height =?, weight =?, deptno = ? WHERE studno=?";
      const input_data = [
        name,
        userid,
        grade,
        idnum,
        birthdate,
        tel,
        height,
        weight,
        deptno,
        studno,
      ];
      const [result1] = await dbcon.query(sql, input_data);

      //   결과 행 수가 0이라면 예외처리
      if (result1.affectedRows < 1) {
        throw new Error("수정된 데이터가 없습니다.");
      }

      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 = "SELECT * FROM student WHERE studno=?";
      const [result2] = await dbcon.query(sql2, [studno]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.sendJson({ item: json });
  });

  //   데이터 삭제 --> DELETE
  router.delete("/student/:studno", async (req, res, next) => {
    const studno = req.get("studno");

    if (studno === undefined) {
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

      //데이터 삭제하기
      const sql = "DELETE FROM student WHERE studno=?";
      const [result1] = await dbcon.query(sql, [studno]);
      logger.debug([result1]);
      if (result1.affectedRows < 1) {
        throw new Error("삭제된 데이터가 없습니다.");
      }
    } catch (e) {
      return next(e);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과를 구성
    res.sendJson();
  });
  return router;
};
