import "./css/App.css";
import Login from "./components/Login";
import { AuthContext, AuthProvider } from "./components/AuthContext";
import { useContext } from "react";
import DashBoard from "./components/DashBoard";
import { BrowserRouter } from "react-router-dom";

// 컴포넌트를 분리하여 하위 컴포넌트에서 useContext를 이용하는 과정 (컴포넌트 분리)

function App() {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  );
}

function AppComponent() {
  // 로그인을 헀다면 dashBoard 랜더링
  // 로그인을 안 했다면 login 랜더링
  // 로그인을 했는지 안했는지 기억해줄 상태값은 user
  // user에는 로그인한 사람에 대한 정보가 세팅되어 있다.
  // user는 Authcontext안에 있다
  // ContextAPI를 이용하여 랜더링 조건처리 하면 된다.

  const { user } = useContext(AuthContext); // AuthContext를 이용하는 useContext 훅

  return (
    <>
      {user ? (
        <div className="body-container">
          {/* BrowserRouter: 리액트 앱에서 
          url 경로에 따라 컴포넌트를 보여줄 수 있게 해주는 라우팅 컨테이너 (최상위 부모 컴포넌트) 
          -> Route, Link, NavLink, userNavigate()와 같은 라우팅 관련 기능을 사용하려면 
          모든 라우팅 요소들을 BrowserRouter 컴포넌트로 감싸야 한다
          */}
          <BrowserRouter>
            <DashBoard />
          </BrowserRouter>
        </div>
      ) : (
        <div className="login-section">
          <Login />
        </div>
      )}
    </>
  );
}

export default App;
