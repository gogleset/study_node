# 웹 파라미터 (2)

---

## #01. POST 파라미터

HTML의 `<form>` 태그에서 `method`속성을 `POST`로 부여한 경우를 의미.

변수가 URL에 노출되지 않기 때문에 상대적으로 보안에 유리하지만,
결코 전송되는 변수를 볼 수 없다는 것을 의미하지는 않는다.

Node.js 스스로는 POST 파라미터를 처리하지 못하므로 다음의 패키지를 설치해야 한다.

```shell
npm install --save body-parser
```

## #02. PUT, DELETE 파라미터

HTTP 1.1에서는 지원하지 않는 속성 (HTTP 2.0부터 지원)

HTML의 `<form>` 태그는 이 방식을 지원하지 않는다.

기본적으로 POST 방식과 동일하면서 전송방식의 이름만 변경한 형태.

Node.js 스스로는 PUT, DELETE 파라미터를 처리하지 못하므로 다음의 패키지를 설치해야 한다.

```shell
npm install --save method-override
```


## #03. RestfulAPI

하나의 URL이 어떤 개체(ex-상품,회원 등)를 의미하고 GET, POST, PUT, DELETE 전송방식에 따라 조회,입력,수정,삭제 기능을 구분하는 구현 형태

대부분 OpenAPI는 Restful API 방식을 따른다.

| 전송방식 | 수행할 동작 | 의미   |
| -------- | ----------- | ------ |
| POST     | 입력        | Create |
| GET      | 조회        | Read   |
| PUT      | 수정        | Update |
| DELETE   | 삭제        | Delete |

위의 네가지 방식을 CRUD라 부른다.

즉, Restful API는 CRUD 방식을 따르는 표준.