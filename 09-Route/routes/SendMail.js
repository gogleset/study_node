module.exports = (app) => {
    const router = require('express').Router();
    const logger = require("../../helper/LogHelper");
    const config = require('../../helper/_config');
    const nodemailer = require('nodemailer') //메일발송 app.use 추가설정 x

    // router.route("URL 경로").get || post || put || delete((req, res) => {})
    // router.get || post || put || delete("URL경로",(req, res) => {})
    /**07-SendMail.js */
router.route("/send_mail").post(async (req, res, next) => {
    /**1) 프론트엔드에서 전달한 사용자 입력값 */
    const writer_name = req.body.writer_name;
    let writer_email = req.body.writer_email;
    const receiver_name = req.body.receiver_name;
    let receiver_email = req.body.receiver_email;
    const subject = req.body.subject;
    const content = req.body.content;
  
    /**2) 보내는 사람, 받는 사람의 메일주소와 이름 */
    // 보내는 사람의 이름과 주소
    if (writer_name) {
      // ex) 최진 <choij2494@gmail.com>
      writer_email = writer_name + " <" + writer_email + ">";
    }
  
    // 받는 사람의 이름과 주소
    if (receiver_name) {
      reciver_email = receiver_name + " <" + receiver_email + ">";
    }
  
    /**3) 매일발송정보 구성 */
    const send_info = {
      from: writer_email,
      to: receiver_email,
      subject: subject,
      html: content,
    };
    logger.debug(JSON.stringify(send_info));
  
    const smtp = nodemailer.createTransport({
      host: config.sendmail_info.host, //SMTP 서버명 : smtp.gmail.com
      port: config.sendmail_info.port, //SMTP 포트 : 587
      secure: config.sendmail_info.secure, //보안연결(SSL)필요
      auth: config.sendmail_info.auth,
    });
  
    // 4) 메일 발송 요청
    try {
      await smtp.sendMail(send_info);
    } catch (err) {
      console.error(err);
      return res.status(500).send("error");
    }
  
    res.status(200).send("ok");
  });
    return router;
};