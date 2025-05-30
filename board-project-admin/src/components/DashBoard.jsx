import "../css/DashBoard.css";
import { NavLink, useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Statistics from "./Statistics";
import Restore from "./Restore";
import Manager from "./Manager";
import Chart from "./Chart";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import logo from "../assets/logo.jpg";

// react- router - dom : react 어플리케이션에서 라우팅을 구현하기 위해 사용하는 라이브러리

// 라우팅: 사용자가 요청한 url 경로에 따라 적절한 페이지 혹은 리소스를 (여기서는 컴포넌트를) 제공하는 과정

export default function DashBoard() {
  const globalState = useContext(AuthContext);
  const navigate = useNavigate();

  // 라우팅은 태그 자체가 다름!

  const goDashBoardMain = () => {
    // "메인 페이지로 이동" location.href = "/"도 사용은 가능 함 (기존 js 식으로) => 동기식이라 사용 안 함
    // 브라우저의 기본 동작을 이용하여 새로고침하면 이동한다면 리액트의 SPA철학을 위배함
    navigate("/");
  };

  return (
    <div className="dash-board-container">
      <div className="dash-board-header">
        <button id="logo-btn" onClick={goDashBoardMain}>
          <img src={logo} alt="관리자페이지로고" />
        </button>
      </div>
      <div className="admin-info">
        <p>현재 접속 관리자 : {globalState.user.memberNickname} </p>
        {/* context API내의 유저가 닉네임 정보를 가지고 있음 */}
        <button onClick={globalState.handleLogout}>로그아웃</button>
        {/* user를 가진 AuthContext가 가지는 것이 맞음 */}
      </div>

      {/* 현재 url이 to속성에 있는 주소와 일치하면 액티브로 인식 => 액티브라는 클래스가 추가 됨
        해당 컴포넌트를 클리갛면 to="/경로"라는 경로로 이동한다.
        클릭만 하면 파란색이 보임 <a class="active" href="/경로"/>와 같이 class를 추가한다. 
        link는 이동은 시키지만 이런건 안 해줌
        */}
      <div className="router-tab-box">
        <NavLink to="/statistics">통계</NavLink>
        <NavLink to="/restore">복구</NavLink>
        <NavLink to="/manager">관리자메뉴</NavLink>
      </div>

      {/* Route를 이용하여 각 URL에 맞게 컴포넌트를 연결한다 */}
      <Routes>
        <Route path="/" element={<Chart />} />

        <Route path="/statistics" element={<Statistics />} />
        <Route path="/restore" element={<Restore />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
      {/* 
      npm install recharts
      <ul className="tab-box">
        <li className="active">복구</li>
        <li>통계</li>
        <li>관리자 메뉴</li>
      </ul> */}
    </div>
  );
}
