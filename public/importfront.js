

// 여덟개의 인자를 받습니다.
const imports = (
    merchant_uid,
    name,
    amount,
    buyer_email,
    buyer_name,
    buyer_tel,
    buyer_addr,
    buyer_postcode
) => {
    console.log("imports 함수 실행");
    console.log(merchant_uid);
    console.log(buyer_email);
    const { IMP } = window;
    IMP.init("imp27242603"); //자신이 발급받는 가맹점 식별코드
    let requestPay = () => {
        // IMP.request_pay(param, callback) 결제창 호출
        IMP.request_pay(
            {
                // param
                pg: "html5_inicis",
                pay_method: "card",
                merchant_uid: `${merchant_uid}`,//결제번호 (사이트에서 임의로 만들어준 번호)
                name: `${name}`,//상품명
                amount: amount,//결제 합계
                buyer_email: `${buyer_email}`,//결제자 이메일
                buyer_name: `${buyer_name}`,//결제자 이름
                buyer_tel: `${buyer_tel}`,//결제자 전화번호(핸드폰)
                buyer_addr: `${buyer_addr}`,//결제자 주소
                buyer_postcode: buyer_postcode,//결제자 우편번호
            },
            async (rsp) => {
                // callback
                console.log(merchant_uid);
                let json = null;
                if (rsp.success) {
                    let msg = "결제가 완료되었습니다.";
                    msg += "고유ID : " + rsp.imp_uid;
                    msg += "상점 거래ID : " + rsp.merchant_uid;
                    msg += "결제 금액 : " + rsp.paid_amount;
                    msg += "카드 승인번호 : " + rsp.apply_num;
                    alert(msg);

                    // 아임포트 라우터(백엔드)에 결제정보와 주문번호 투척
                    try {
                        const result = await axios.post("/import", {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                        });
                        console.log("백엔드 전송완료 후 프론트엔드 값 받아오기 성공");
                        console.log(result.data);
                    } catch (e) {
                        msg = e;
                        alert(msg);
                    }
                } else {
                    let msg = "결제에 실패하였습니다.";
                    msg += "에러내용 : " + rsp.error_msg;
                    alert(msg);
                }
            }
        );
    };
    requestPay();
};
