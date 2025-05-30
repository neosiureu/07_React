import axios from "axios";
import React, { useContext, useState } from "react";
import "../css/Login.css";
import { AuthContext } from "./AuthContext";

function Login() {
  const globalState = useContext(AuthContext);

  // 1. 메인 어플리케이션은 유저들이 이용한다
  // 2, 클라이언트 사이드로 만들어진 관리자페이지에 데이터를 제공할 수 있는 API의 역할을 한다
  return (
    <div className="login-container">
      <h1>KH BoardProject Admin</h1>
      <h2>로그인</h2>
      <form onSubmit={globalState.handleLogin}>
        <div className="form-group">
          <label htmlFor="username">이메일:</label>
          <input
            type="email"
            id="email"
            required
            // onChange={(e) => setEmail(e.target.value)}
            onChange={globalState.changeInputEmail}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="password"
            // onChange={(e) => setPassword(e.target.value)}
          >
            비밀번호:
          </label>
          <input
            type="password"
            id="password"
            required
            onChange={globalState.changeInputPw}
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
