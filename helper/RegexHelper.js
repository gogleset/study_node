/**
 * @filename  : regex_helper.js
 * @author    : 최진 (choij2494@gmail.com)
 * @description : 정규표현식 검사 수행 후 , true/false로 해당 정규 표현식 충족하는지 여부를 반환하는 함수들의 모음
 *
 *
 */
const BadRequestException = require("../exceptions/BadRequestException");

class RegexHelper {
  // constructor(){}

  /**
   * 값의 존재 여부를 검사한다.
   * @param {string} content 입력내용 
   * @param {string} msg  값이 없을 경우 표시할 메시지 내용
   */
  value(content, msg) {
    console.log(
      "RegexHelper value 함수 실행, content 값 = %s, msg 값 = %s",
      content,
      msg
    );
    if (content == undefined || content == null || content.trim().length == 0) {
      throw new BadRequestException(msg);
    }

    return true;
  }

  /**
   * 입력값이 지정된 글자수를 초과했는지 검사한다.
   * @param {string} content     입력내용 
   * @param {int} len             최대 글자수
   * @param {string} msg          값이 없을 경우 표시될 메시지
   */
  maxLength(content, len, msg) {
    console.log(
      "RegexHelper maxLength 함수 실행, content 값 = %s, len 값 = %s, msg 값 = %s",
      content,
      len,
      msg
    );
    if (!this.value(content) || content.length > len) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 입력값이 지정된 글자수 미만인지 검사한다.
   * @param {string} content  입력내용 
   * @param {int} len     최대 글자수
   * @param {string} msg  값이 없을 경우 표시될 메시지
   */
  minLength(content, len, msg) {
    console.log(
      "RegexHelper minLength 함수 실행, content 값 = %s, len 값 = %s, msg 값 = %s",
      content,
      len,
      msg
    );
    if (!this.value(content) || content.length < len) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 두 값이 동일한지 검사한다.
   * @param {string} origin  원본
   * @param {string} compare  검사 대상
   * @param {string} msg       검사에 실패할 경우 표시할 메시지
   */
  compareTo(origin, compare, msg) {
    let src = origin.trim(); //원본값을 가져온다
    let dsc = compare.trim(); //비교할 값을 가져온다
    console.log(
      "RegexHelper compareTo 함수 실행, origin 값 = %s, compare 값 = %s, msg 값 = %s",
      origin,
      compare,
      msg
    );
    if (src != dsc) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 입력값이 정규 표현식을 충족하는지 검사한다.
   * @param {string} content    입력 요소에 해당하는 
   * @param {string} msg         표시할 메시지
   * @param {object} regex_expr  검사할 정규 표현식
   * @return {boolean}   표현식을 충족할 경우 true / 그렇지 않은 경우 false
   */
  field(content, msg, regexExpr) {
    let src = content.trim();

    // 입력값이 없거나 입력값에 대한 정규표현식 검사가 실패라면?
    console.log(
      "RegexHelper filed 함수 실행, content 값 = %s, msg 값 = %s, regexExpr 값 = %s",
      content,
      msg,
      regexExpr
    );
    if (!src || !regexExpr.test(src)) {
      throw new BadRequestException(msg);
    }
    return true;
  }

  /**
   * 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  num(content, msg) {
    console.log(content, msg);
    return this.field(content, msg, /^[0-9]*$/);
  }
  /**
   * 영문으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  eng(content, msg) {
    return this.field(content, msg, /^[a-zA-Z]*$/);
  }
  /**
   * 한글로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  kor(content, msg) {
    return this.field(content, msg, /^[ㄱ-ㅎ가-힣]*$/);
  }
  /**
   * 영문과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  engNum(content, msg) {
    return this.field(content, msg, /^[a-zA-Z0-9]*$/);
  }
  /**
   * 한글과 숫자로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  korNum(content, msg) {
    return this.field(content, msg, /^[ㄱ-ㅎ가-힣0-9]*$/);
  }
  /**
   * 이메일로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  email(content, msg) {
    return this.field(
      content,
      msg,
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    );
  }
  /**
   * 핸드폰 형식으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  cellphone(content, msg) {
    return this.field(content, msg, /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
  }
  /**
   * 집전화 형식으로만 이루어 졌는지 검사하기 위해 field()를 간접적으로 호출한다.
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  telphone(content, msg) {
    return this.field(content, msg, /^\d{2,3}\d{3,4}\d{4}$/);
  }
  /**
   * 핸드폰 번호 형식과 집전화 번호 형식 둘중 하나를 충족하는지 검사
   * @param {string}  content 입력내용 
   * @param {string}  msg      표시할 메시지
   */
  phone(content, msg) {
    let check1 = /^01(?:0|1|[6-9])(?:\d{3}|\d{4}\d{4}$)/;
    let check2 = /^\d{2,3}\d{3,4}\d{4}$/;

    let src = content.trim();

    // 핸드폰형식, 집전화형식도 아니라면?
    if (!src || (!check1.test(src) && !check2.test(src))) {
      throw new BadRequestException(msg);
    }
    return true;
  }
}

module.exports = new RegexHelper();
