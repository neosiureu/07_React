// 컴포넌트는 아니고 (js) axios에 대한 API를 만들어 js변수형태로 저장하겠다.

import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://localhost",
  /*
  headers: { "Content-Type": "application/json" },
  withCredentials: true (쿠키를 포함하고 싶다는 설정)
  JWT 기술: JSON Web Token: 서버가 토큰을 만들어 클라이언트에게 준다
  클라이언트는 해당 토큰을 쿠키에 저장한다.
  클라이언트는 자기가 인증받은 클라이언트라는 것을 서버에 알림
  서버에서도 클라이언트가 보낸 쿠키를 받아줄 준비를 해야 한다
  서버에서도  credential 허용 설정 필요함
  이는 JWT를 사용할 때 중요한 옵션임
  */
 
});
