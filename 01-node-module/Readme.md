# Node Moduels

Node.js 안에 처음부터 내장되어 있는 모듈들.

Javascript의 내장 객체와는 다른 개념.

## path 모듈

Node가 구동중인 컴퓨터 내의 경로를 관리하는 기능.

Javascript의 location객체가 페이지의 URL을 관리한다면, Node의 Path모듈은 내 컴퓨터 안의 파일 경로를 관리한다.

## url 모듈

URL의 각 파트를 조회하거나, 파트별 값을 결합하여 완성된 URL을 생성하는 기능.

location객체와 비슷함.

## querystring 모듈

URL에 "?" 이후에 포함되는 변수값들을 추출하여 JSON object로 변환.

javascript의 location객체는 "?"이후 부분을 하나의 문자열로만 추출한다.

querystring모듈은 "?"이후 부분을 `{변수명: 값, 변수명: 값}` 형식의 객체로 파싱처리 함.

## os모듈

Node가 구동중인 운영체제의 기본 정보들을 조회하는 기능.

현재 컴퓨터의 메모리 사용량을 모니터링.

(중요) 현재 컴퓨터의 CPU 정보 (수량, 성능, 모델명 등...)

현재 컴퓨터의 네트워크 정보

## npm 명령어

프로젝트가 의존하는 패키지(혹은 플러그인)들을 다운로드 받기 위해 사용하는 명령어

### 1) 프로젝트 최초 시작시 npm 초기화

프로젝트 root 폴더 위치에서 명령 프롬프트를 열고 아래의 명령어 수행 후 몇가지 프로젝트 정보를 입력해야 한다.

아래 명령어의 결과로 프로젝트 폴더 안에 package.json 파일이 생성된다.

```shell
npm init
```

```shell
yarn init
```

### 2) 필요한 패키지를 다운로드 받고자 할 때

프로젝트 root 폴더 위치에서 명령 프롬프트를 열고 아래의 명령어 수행.

`--save` 옵션을 지정하면 사용하는 패키지 정보가 package.json 파일에 기록된다.

```shell
npm install --save 패키지이름
```
```shell
yarn add 패키지이름
```


### 3) 패키지를 삭제할 경우

프로젝트 root 폴더 위치에서 명령 프롬프트를 열고 아래의 명령어 수행.

`--save` 옵션을 지정하면 삭제되는 패키지 정보가 package.json 파일에서도 제거된다.

```shell
npm uninstall --save 패키지이름
```
```shell
yarn remove 패키지이름
```

### 4) 프로젝트를 완성하여 결과물 배포시

node_modules 폴더 내의 패키지들을 함께 배포하거나 git에 업로드 할 경우 저작권에 위배됨.

그러므로 패키지 파일들은 삭제 후 배포해야 한다.

배포된 소스코드를 내려받은 사람은 프로젝트 root 폴더 위치에서 명령 프롬프트를 열고 아래의 명령어를 수행하면 package.json 파일에 기록된 모든 패키지들을 일괄 다운로드 받을 수 있다.

```shell
npm install
```
```shell
yarn install
```