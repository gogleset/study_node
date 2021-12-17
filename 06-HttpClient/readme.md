# HTTP Client

URL을 통해서 다른 웹 컨텐츠에 접속하여 내용을 가져오는 기술.

- URL이 웹 페이지인 경우 HTML코드를 가져온다.
  - 웹 페이지가 실행되는 과정에서 JS에 의해 동적으로 변경되는 내용은 가져오지 못한다.
- URL이 text, xml, json인 경우 원본 내용을 가져온다.

## 웹 브라우저에서의 Http Client

웹 브라우저에서는 XMLHttpRequest 클래스를 통해서 같은 기능을 구현할 수 있다. -> Ajax

기존의 웹페이지는 새로운 컨텐츠를 표시하기 위해서는 Page refresh가 필수.

Ajax가 사용되면 페이지 새로고침 없이 다른 URL의 내용을 js만으로 로딩해서 특정 DOM요소에 출력할 수 있게 된다.

단, 웹브라우저 자체의 CORS 제약으로 인해 현재 브라우저가 접근하고 있는 html이 속한 도메인과 다른 도메인의 URL은 접근 불가.

접근하기 위해서는 Ajax가 할 수 있는 것은 없다.

접근 해당이 외부로부터의 접근을 허용해야 한다.

## 백엔드에서의 Http Client

XMLHttpRequest가 아닌 일반 응용프로그램이 사용하는 Socket 통신 기술을 사용하기 때문에 어떤 도메인으로 접근 가능.

## HTTP 통신을 위한 확장 모듈 사용하기

원래 Node.js에서는 http라는 내장 모듈을 사용하지만 사용성이 다소 번거롭기 때문에 코드의 효율적인 작성을 위해 개선된 라이브러리가 배포되고 있다.

1. axios (범용, 권장)
2. requests (Node.js용)

### axios 모듈 설치

```shell
npm install --save axios
```