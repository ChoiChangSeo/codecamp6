// ##   정규표현식
// 핸드폰 번호를 검증할때 010-1234-1234 이면 복잡하게 for문과 if문을 사용해야하는데 정규표현식을 사용하면 더 간단하게 만들 수 있다.
//   정규 표현식을 사용할때는 양 옆에 /을 달아주고 .test를 찍어주고 ()안에 있는 입력값이 apple(조건)이 맞는지 확인하는것이다.
// >   /apple/.test("apple")
//   true
//   /apple/.test("appleq")
//   false
//     /a@a.com/.test("a@a.come")
//   true
//   /a@a.com/.test("b@a.come")
//   false

// 역슬래쉬를 붙여주면 단순 문자열 w 기능에서 벗어나서 \w는 문자 혹은 숫자를 의미한다. 그래서 @앞에 어떤 글자가 와도 true가 나오게된다. 또한 여러 글자가 들어와도 검증이 가능하다.
// > /\w@a.come/.test("c@a.com")
//   true

// 앞에 조건이 어디 중간에 끼어있기만해도 true가 나온다.
// >   /\w@a.come/.test("cddqdw@a.com")
//   true

// 이를 해결하기 위해 ^,$ 를 붙여주면 전체를 비교하여 해결이 가능하다 이렇게되면 문자열을 전부 검증하기위해 \w를 잔뜩 넣어줘야하는데 이때 필요한게 1개 이상이면 +를 추가해주면 검증이 가능하다 또한 ?를 추가하여 없가나 1개일때 true가 나오게도 검증할 수 있다.
// 없거나 한개거나 그 이상일때(모든것을 만족시킬때)*를 사용해주면된다.
// >   /^\w@a.come$/.test("cddqdw@a.com")
//   false
//   /^\w+@a.come/.test("cddqdw@a.com")
//   true
//   /^\w?@a.come/.test("@a.com")
//   true
//   /^\w*@a.come/.test("@a.com")
//   true

//   아래는 이메일을 검증하는 식이다 @가 있는지 확인하고 @뒤에 문자가 있는지 확인해준다. 또한 모든 이메일이 .com만 있는게 아니기 때문에 \w를 추가해준다. 하지만 .을 모든것이라고 인식해서 .대신 다른 문자가 와도 true를 반환한다. 이를 해결하기 위해 .앞에 \를 붙여준다
// >   /^\w*@\w+.\w+$/.test("ewfwf@a:com")
//   true
//   /^\w*@\w+\.\w+$/.test("ewfwf@a:com")
//   false

//   핸드폰 번호 정규표현식 검증
// >   /010-1234-5678/.test("010-1234-5678")
//   true

//   숫자를 의미하는것은 \d사용
//   자리수 정하는 방법은 {} 사용
// >   /^\d{3}\-\d{3,4}\-\d{4}$/.test("010-1234-5678")
//    true

//   숫자만 의미하는 정규표현식은 있지만 문자만 표현하는 표현식은 없어서
//  ** [a-zA-Z]**을 써줘야한다.
//   공백의 경우 **\s**를 써주면된다.
