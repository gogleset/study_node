# 파일 업로드

---

## 파일 전송 (Frontend)

HTML의 `form` 상에서 `<input type='file'>` 요소를 사용하여 `form`에 명시된 `action` 페이지 (=백엔드)로 전송함.

Ajax는 파일 업로드가 불가능하므로 Javascript의 file api를 사용하여 별도로 업로드 기능을 구현해야 함. (Frontend 영역)

파일 전송시에는 반드시 `<form>` 태그에 `enctype="multipart/form-data"` 속성이 명시되어야 함.

그런 이유로 파일 업로드를 백엔드에서는 multipart 전송이라고 표현하기도 함.

GET 방식 전송으로는 처리가 불가.

```html
<form method='post' action='/upload/simple' enctype='multipart/form-data'>
    <input type='file' name='myphoto' />
    <input type='submit'>
</form>
```

## 파일 수신 (Backend)

### node의 `multer` 패키지 사용

```shell
npm install --save multer
```

[https://github.com/expressjs/multer/blob/master/doc/README-ko.md](https://github.com/expressjs/multer/blob/master/doc/README-ko.md)

### 업로드 객체에 대한 환경 설정

```javascript
var multipart = multer({
    storage: multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 업로드_될_파일이_저장될_폴더경로);
        },
        filename: function(req, file, callback) {
            callback(null, 저장될_파일이름);
        }
    }),
    limits: { // 업로드 제약
        files: 최대업로드가능_파일수(int),
        fileSize: 최대업로드가능_크기(byte단위)
    }
});
```

### 백엔드 페이지에서 업로드 처리

```javascript
// 업로드를 위한 함수 클로저 리턴받기 (멀티업로드인 경우 single 대신 array 함수 사용)
var upload = multipart.single('input태그의 name속성값');

upload(req, res, function(err) {
    if (err) { ... 에러가 발생한 경우 ... }
    
    ... 업로드 성공시 처리 ...
});
```