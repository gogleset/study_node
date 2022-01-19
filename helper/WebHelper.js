const logger = require("./LogHelper");

module.exports = () => {
  return (req, res, next) => {
    /**GET, URL, POST, PUT, DELETE, 파라미터를 수신하여 값을 리턴하는 함수 */
    req._getParam = (method, key, def=null) => {
        // 파라미터를 HTTP 전송방식에 따라 받는다.
        console.log(method);
        console.log(key);
        console.log(def);

        let value = null;

        // 1)undefined인 경우 def값으로 대체
        // --> 파라미터를 받지만 빈 문자열이거나 공백으로만 구성된 경우는 걸러내지 못한다.
        if(method.toUpperCase() === 'GET') {
            console.log("query value = %s, params value = %s", req.query, req.params);
            // query, params
            value = req.query[key] || req.params[key] || def;
            console.log("GET 방식인 경우 값은 = " + value);
        } else {
            console.log("body value = %s", req.body);
            // POST, PUT, DELETE의 방식인 경우
            value = req.body[key] || def;
            console.log("GET 방식이 아닌 경우 값은 = " + value);
        }

        // 빈 문자열이거나 공백인 경우 잘라내기
        if(value !== null){
            value = value.trim();

            if(value.length === 0){
                // 공백을 잘라낸 후에도 값이 없다면 null
                value = def;
            }
        }
        logger.debug('[HTTP %s Params %s = %s', method, key, value);
        return value;
    };

    // get 파라미터 수신함수 --> _get_param 함수를 호출한다.
    req.get = function(key, def){
        return this._getParam('GET', key, def);
    };

    // post 파라미터 수신함수 --> _get_param 함수를 호출한다.
    req.post = function(key, def){
        return this._getParam('POST', key, def);
    };

    // put 파라미터 수신함수 --> _get_param 함수를 호출한다.
    req.put = function(key, def){
        return this._getParam('PUT', key, def);
    };

    // delete 파라미터 수신함수 --> _get_param 함수를 호출한다.
    req.delete = function(key, def){
        return this._getParam('DELETE', key, def);
    };

    // 프론트엔드에게 JSON결과를 출력하는 기능
    res.sendResult = (statusCode, message, data) => {
        const json = {
            rt: statusCode,
            rtmsg: message
        }

        if(data !== undefined){
            for( const key in data){
                json[key] = data[key];
            }
        }

        json.pubdate = new Date().toISOString();
        res.status(statusCode).send(json);
    };

    // 결과가 200(OK)인 경우에 대한 JSON 출력
    res.sendJson = (data) => {
        res.sendResult(200, 'OK', data);
    }

    // 400에러가 발생한 경우에 대한 Error를 JSON으로 출력한다.
    res.sendBadRequest = () => {
        res.sendResult(400, '잘못된 요청입니다.');
    };

    // 404 에러가 발생한 경우에 대한 Error를 JSON으로 출력한다.
    res.sendNotFound = () => {
        res.sendResult(404, '페이지를 찾을 수 없습니다.');
    }

    // 500 에러가 발생한 경우에 대한 Error를 JSON으로 출력한다.
    res.sendRuntimeError = () => {
        res.sendResult(500, '요청을 처리하는데 실패했습니다.');
    }
    next();
  };
};
