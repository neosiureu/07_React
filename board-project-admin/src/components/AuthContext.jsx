import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext(); // 사용할 때 쓰기위해 필요
// context는 react에서 컴포넌트 계층 구조(트리)를 통해 데이터를 효율적으로 전달하기 위한 작동원리
// 컴포넌트간의 전역 상태를 공유할 수 있는 컨텍스트를 생성한다.

// context는 provider와 consumer가 존재 (제공자 vs 소비자)
// 전역 상태를 제공하는 provider를 정의한다.

export const AuthProvider = ({ children }) => {
  // 제공할떄 쓰기위해 필요
  // 해야할 일이 많음 함수, 상태값 등
  const [user, setUser] = useState(() => {
    const storeUser = localStorage.getItem("userData");
    return storeUser ? JSON.parse(storeUser) : null; // 익명함수 내부에서는 돌려받을 값이 있을 때 돌려받아야 함
  });

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // 이메일 입력에 대한 핸들러 함수 onChange={(e) => setEmail(e.target.value)}

  const changeInputEmail = (e) => {
    setEmail(e.target.value);
  };

  // 패스워드 입력에 대한 핸들러 함수

  const changeInputPw = (e) => {
    setPassword(e.target.value);
  };

  // 로그인처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    // 비동기로 서버쪽으로 로그인요청 보낸다.
    // 스프링부트를 이용해 서버를 만든다.
    const response = await axios.post(
      "http://localhost/admin/login",
      {
        memberEmail: email, //자동 스트링 형으로변환됨 json은 자동으로 문자열이라는 보장이 있음
        memberPw: password,
      }
      // ,{ "Content-Type": "application/json"} // <- 생략가능
    );
    console.log(response);

    const adminInfo = response.data;

    if (adminInfo.length === 0) {
      alert("이메일 또는 비밀번호가 불일치합니다.");
      return;
    }
    // 상태에 세팅
    setUser(adminInfo);

    /* 여기까지만 하면 새로고침만 해도 그냥 로그인이 풀려버리는 화면을 보여줄 뿐

    진짜 로그인하려면 클라이언트측에 브라우저를 닫아도 영구적으로 유지되는 데이터를 저장해야 함

    클라이언트 측에 쿠키, 로컬스토리지, 세션스토리지

    로컬스토리지 vs 세션 스토리지

    브라우저에서 현재 로그인한 관리자의 정보를 기억하도록 해야 함

    로컬 스토리지: 브라우저를 닫아도 데이터가 영구적으로 유지 됨. 브라우저의 전역에서 사용할 수 있다.
    세션 스토리지: 브라우저 탭 또는 창을 닫으면 데이터가 즉시 삭제 된다. 현재 탭 또는 창에서만 데이터가 유지된다.
    쿠키와 달리 이 둘은 유효기간의 만료 기능이 없다.*/

    localStorage.setItem("userData", JSON.stringify(adminInfo)); // 문자열로 변경 안하면 문자가 아닌 것이 잘못 저장
    /* 
    로컬스토리지에 데이터 저장하는 법
    adminInfo를 넣어야 함 user를 넣으면 안 됨
    비동기 형식으로 상태가 변경되는데 user를 쓰면 변경 전에 상태를 호출하게 되는 상황 (null일 수도 있음)
    */

    // 무조건 1시간 뒤에 로그아웃 되게끔 setTimeOut을 써버리면 됨 (타이머 설정)
    setTimeout(() => {
      localStorage.removeItem("userData"); // 1시간이 지나면 localStorate에 있는 데이터 삭제
      setUser(null);
      alert("재로그인 해주세요!");
      window.location.href = "/"; // 다만 React에서는 navigator라는 함수를 사용하곤 한다.
    }, 60 * 60 * 1000);
  };

  // setUser라는 것은 화면을 리랜더링 하기 위해 존재 vs 로컬스토리지는 영구저장을 위해 존재

  // 자식에 해당하는 하위 컴포넌트에게 전달할 데이터를 하나로 묶는다 => globalState

  const handleLogout = async () => {
    // localStorage의 유저 데이터가 없어야 한다
    // 서버 역시 loginMember를 기억하고 있음. 즉 서버에 요청이 있긴 해야 함. 여전히 세션에 있는 값을 기억하는 중

    try {
      // 요청보내는 코드
      const resp = await axios.get("http://localhost/admin/logout");
      console.log(resp);

      if (resp.status === 200) {
        localStorage.removeItem("userData");
        setUser(null);
      }
    } catch (error) {
      console.log("로그아웃 중에 문제 발생 :", error);
    }
  };

  const globalState = {
    user,
    changeInputEmail,
    changeInputPw,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={globalState}>{children}</AuthContext.Provider>
  );
  // 전역적으로 현재 로그인한 회원의 정보를 기억한다 (상태)
};
