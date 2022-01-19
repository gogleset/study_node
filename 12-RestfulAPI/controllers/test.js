// 객체 확장 예제

const hello = () => {
    return (req, res, next) => {
        // 자바스크립트 req라는 객체에 기능을 확장시킨다.
        req.asdasdasd = () => {
            for(let i = 0; i < 10; i++) {
                let s = "";
                for(let j = 0; j < i+1; j++){
                    s += "*";
                }
                console.log(s);
            }
        }

        next();
    };
};

module.exports = hello;

