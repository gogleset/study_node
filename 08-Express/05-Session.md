# 세션

----

쿠키와 마찬가지로 사이트 내의 모든 페이지가 공유하는 전역변수.

단, 유효시간은 설정할 수 없기 때문에 브라우저가 닫히거나 마지막 접속 이후 5분간 재접속이 없다면 자동 폐기된다. (시간은 설정 가능함)

특정 클라이언트에게 종속된 개인화 정보를 백엔드가 직접 저장/관리하는 형태.

많은 데이터를 보관할 수는 없다.

쿠키보다 보안에 유리하므로 로그인 정보 관리 등에 사용된다.

Web 접속은 일회성 접속으로써 한페이지 안에서만 변수가 유효하게 된다.

웹페이지의 데이터베이스는 일회성 변수를 커버하기 위함이다.

세션을 DB 에 저장하는 기술을 SSO라고 한다

```shell
npm install --save express-session
```