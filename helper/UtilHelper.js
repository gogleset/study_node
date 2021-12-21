const os = require('os');

module.exports.myip = () => {
    // ip의 값이 담길 배열
    const ipAddress = [];

    // os에 담긴 네트워크 정보가 배열형식으로 담겨있음
    const nets = os.networkInterfaces();
    console.log(nets);

    // nets의 키값을 attr에 전달
    for(const attr in nets){
        // 키값이 출력
        // console.log(attr);
        // item에 키 값에 대응하는 값들을 넣어줌
        const item = nets[attr];
        // console.log(nets[attr]);

        // item에서 v.familly의 값이 IPv4와 v.address가 127.0.0.1로 값이 다르다면 ipAddress의 배열에 v.address값을 배열에 넣어줌
        item.map((v,i) => {
            if(v.family == 'IPv4' && v.address != '127.0.0.1'){
                ipAddress.push(v.address);
            }
        });
    }
    return ipAddress;
};