const multer = require("multer");

class MultipartException extends Error {
  constructor(err) {
    let msg = null;

    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_COUNT":
          msg = "업로드 가능한 파일 수를 초과했습니다.";
          break;
        case "LIMIT_FILE_SIZE":
          msg = "업로드 가능한 파일 용량를 초과했습니다.";
          break;
        default:
          msg = "알 수 없는 에러가 발생했습니다.";
          break;
      }
    }
    super(msg);
    this._statusCode = 500;
  }
  get statusCode() {
      return this._statusCode;
  }
}

module.exports = MultipartException;
