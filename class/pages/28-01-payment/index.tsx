import { useState } from "react";
import Head from "next/head";
// script로 라이브러리를 설치해주기 위해 head를 만들어준다.
declare const window: typeof globalThis & {
  IMP: any;
};

export default function PaymentPage() {
  const [amount, setAmount] = useState(100);

  const requestPay = () => {
    const IMP = window.IMP; // 생략 가능 script로 라이브러리를 다운받아오면 파일을 window에 저장한다.
    IMP.init("imp49910675"); // Example: imp00000000 가맹점 식별코드를 Merchant ID에 넣어줌

    // IMP.request_pay(param, callback) 결제창 호출
    IMP.request_pay(
      {
        // param
        pg: "html5_inicis",
        pay_method: "card",
        // 상품아이디를 중복되지 않게 주거나, 없애버리면 알아서 임의로 아이디가 생김
        // merchant_uid: "ORD20180131-0000011",
        name: "노르웨이 회전 의자",
        amount: amount,
        buyer_email: "gildong@gmail.com",
        buyer_name: "홍길동",
        buyer_tel: "010-4242-4242",
        buyer_addr: "서울특별시 강남구 신사동",
        buyer_postcode: "01181",
        m_redirect_url: "http://localhost:3000/28-01-payment",
      },
      (rsp: any) => {
        // callback
        if (rsp.success) {
          // 결제 성공로직
          console.log(rsp);
          // 백엔드에 결제관련 데이터 넘겨주기(Mutation 실행하기)
          // ex. createPointTransactionOfLoading
        } else {
          // 결제 실패 시 로직,
          alert("결제에 실패하였습니다. 다시 시도해주세요.");
        }
      }
    );
  };
  return (
    <div>
      <Head>
        {/* <!-- jQuery --> */}
        <script
          type="text/javascript"
          src="https://code.jquery.com/jquery-1.12.4.min.js"
        ></script>
        {/* <!-- iamport.payment.js --> */}
        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"
        ></script>
      </Head>
      <button onClick={requestPay}>결제하기</button>
    </div>
  );
}
