"use strict";
/**
 * @filename  : regex_helper.js
 * @author    : 최진 (choij2494@gmail.com)
 * @description : 정규표현식 검사 수행 후 , true/false로 해당 정규 표현식 충족하는지 여부를 반환하는 함수들의 모음
 * 
 * 
 */

class Createid{
    /**
     * 값의 존재 여부를 검사한다.
     * @param {string} selector 입력요소에 해당하는 css 선택자
     * @param {string} msg  값이 없을 경우 표시할 메시지 내용
     * @param {boolean} 입력된 경우 true / 입력되지 않은 경우 false
     */
    value(selector, msg) {
        let field = document.querySelector(selector);
        // 쿼리셀렉터로 파라미터로 받은 값을 문서상에서 가져옴
        // console.log(field);
        const content = field.value.trim();
        // 띄어쓰기 앞 뒤 짤라냄

        if(!content){
            alert(msg);
            field.focus();
            return false;
        }
        return true;
    }

    /**
     * 비밀번호가 맞는지를 검사한다.
     * @param {string} origin 입력요소에 해당하는 css 선택자
     * @param {string} checkequal_origin 비교요소에 해당하는 css 선택자
     * @param {string} msg  값이 없을 경우 표시할 메시지 내용
     * @param {boolean} 입력된 경우 true / 입력되지 않은 경우 false
     */
    compare_to(origin, checkequal_origin, msg){
        const ori = document.querySelector(origin);
        const check = document.querySelector(checkequal_origin);
        let or = ori.value.trim();
        let ch = check.value.trim();

        if(or != ch){
            alert(msg);
            ori.value = '';
            check.value = '';
            ori.focus();
            return false
        }
        return true;
    }

    /**
     * 생년월일이 맞는지 검사한다.
     * @param {string} birth 입력요소에 해당하는 css 선택자
     * @param {boolean} 입력된 경우 true / 입력되지 않은 경우 false
     */
     birth(birth){
        let origin = document.querySelector(birth);
        let msg = "";
        // birth를 가지고 온다.
        let or = origin.value.trim();
        // birth를 가지고 온것을 자른다.
        let date1 = new Date();
        console.log(or);

        if(or.length > 4){
            msg = "4자리 이상입니다."
            alert(msg);
            origin.value = '';
            return false
        }

        if (Number(or) < 1900 || Number(or) > Number(date1.getFullYear())){
            msg = "생년월일이 맞지 않습니다"
            alert(msg);
            origin.value = '';
            return false
        }
        return true;
    }

    /**
     * 태어난 날이 맞는지를 검사한다.
     * @param {string} day 날에 해당하는 css 선택자
     * @param {string} year 년에 해당하는 css 선택자
     * @param {string} month 달에 해당하는 css 선택자
     * @param {boolean} 입력된 경우 true / 입력되지 않은 경우 false
     */
    day(day, year, month){
        const slec = document.querySelector(day);
        // 일을 가져온다
        const mon = document.querySelector(month).value;
        // 달을 가져온다
        const yea = document.querySelector(year);
        // 년도를 가져온다
        let msg = "";
        // 메세지창
        let sl = slec.value.trim();
        let ye = yea.value.trim();
        // 띄어쓰기 잘라주기

        let mo = Number(mon);
        let y = Number(ye);
        
        
        let lastdate = new Date(y, mo, 0)
        // 해당하는 연도와 달의 마지막 날을 할당
        console.log(y);
        console.log(mo);
        console.log(lastdate.getDate());


        if(sl.length > 2 || Number(sl) > Number(lastdate.getDate())){
            msg = "날짜를 확인하세요"
            alert(msg);
            slec.value = "";
            slec.focus();
            return false;
        }else if(sl[0] == 0){
            msg = "날짜 앞자리 0을 빼주세요"
            alert(msg);
            slec.value = "";
            slec.focus();
            return false;
        }
            
        return true;
    }
    /**
     * 입력값이 이메일 정규표현식을 충족하는지 검사한다.
     * @param {string} selector    입력 요소에 해당하는 css 선택자
     * @param {string} msg         표시할 메시지
     * @param {object} regex_expr  검사할 정규 표현식
     * @return {boolean}   표현식을 충족할 경우 true / 그렇지 않은 경우 false
     */
    email(selector, msg) {
        const field = document.querySelector(selector);
        const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        // field에서 받아들어온 selector가 받아들여지고
        let src = field.value.trim();
        // selector에서 받아들어온 value를 잘라서 가공
        console.log(!src);
        console.log(msg);

        if(!src || !regex.test(src)) {
            // !src는 false
            // src가 정규표현식이 맞다면 앞의 부정문을 만나 false
            // false || false니까 false리턴 그러니까 실행안됨
            // test는 정규표현식이 맞는지 판단
            alert(msg);
            field.value="";
            field.focus();
            return false;
        }
        return true;
    }

    /**
     * 입력값이 정규 표현식을 충족하는지 검사한다.
     * @param {string} selector    입력 요소에 해당하는 css 선택자
     * @param {string} msg         표시할 메시지
     * @param {object} regex_expr  검사할 정규 표현식
     * @return {boolean}   표현식을 충족할 경우 true / 그렇지 않은 경우 false
     */
    field(selector, msg, regex_expr) {
        const field = document.querySelector(selector);
        // console.log(field);
        // field에서 받아들어온 selector가 받아들여지고
        let src = field.value.trim();
        // selector에서 받아들어온 value를 잘라서 가공
        console.log(src);
        console.log(msg);
        console.log(regex_expr);

        if(!src || !regex_expr.test(src)) {
            // !src는 false
            // src가 정규표현식이 맞다면 앞의 부정문을 만나 false
            // false || false니까 false리턴 그러니까 실행안됨
            // test는 정규표현식이 맞는지 판단
            alert(msg);
            field.value="";
            field.focus();
            return false;
        }
        return true;
    }


    /**
     * 입력값이 숫자정규 표현식을 충족하는지 검사한다.
     * @param {string} selector    입력 요소에 해당하는 css 선택자
     * @param {string} msg         표시할 메시지
     * @return {boolean}   표현식을 충족할 경우 true / 그렇지 않은 경우 false
     */
    num(selector, msg){
        return this.field(selector, msg, /^[0-9]*$/);
    }

    cellphone(selector, msg) {
        console.log(selector, msg);
        return this.field(selector, msg, /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/);
    }

    kor(selector, msg) {
        return this.field(selector, msg, /^[ㄱ-ㅎ가-힣]*$/);
    }
    eng_number(selector, msg) {
        return this.field(selector, msg, /^[a-zA-Z0-9]*$/);
    }
}