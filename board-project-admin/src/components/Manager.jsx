import React, { useState, useEffect } from "react";
import { axiosApi } from "./../api/axiosAPI";

export default function Manager() {
  /* ---------- 입력 폼 상태 ---------- */
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    tel: "",
  });
  const [adminData, setAdminData] = useState([]);

  /* ---------- input 핸들러 ---------- */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  /* ---------- 관리자 계정 발급 ---------- */
  const createAdminAccount = async () => {
    const { email, nickname, tel } = form;
    if (!email || !nickname || !tel) {
      alert("모든 필드를 입력해주세요");
      return;
    }
    try {
      const res = await axiosApi.post("/admin/createAdminAccount", {
        memberEmail: email,
        memberNickname: nickname,
        memberTel: tel,
      });
      if (res.status === 201) {
        alert(`발급된 비밀번호는 ${res.data} 입니다.`);
      }
      setForm({ email: "", nickname: "", tel: "" });
    } catch (err) {
      alert(err.response?.data);
    }
  };

  useEffect(() => {
    const fetchAdminList = async () => {
      const { data } = await axiosApi.get("/admin/adminList");
      setAdminData(data);
    };
    fetchAdminList();
  }, []);
  return (
    <>
      <div className="manager-div">
        <section className="manager-section">
          <h2>관리자 계정 발급</h2>
          <table>
            <thead>
              <tr>
                <td>사용할 이메일 :</td>
                <td>
                  <input
                    id="email"
                    type="email"
                    placeholder="ex) admin2@kh.or.kr"
                    value={form.email}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>사용할 이름 :</td>
                <td>
                  <input
                    id="nickname"
                    type="text"
                    placeholder="ex) 관리자2"
                    value={form.nickname}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>사용할 전화번호 :</td>
                <td>
                  <input
                    id="tel"
                    type="text"
                    placeholder="ex) 01012341234"
                    value={form.tel}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </thead>
          </table>
          <button
            type="button"
            className="issueBtn"
            onClick={createAdminAccount}
          >
            발급
          </button>
        </section>

        <section className="manager-section">
          <h2>관리자 계정 목록</h2>
          <table className="manager-list-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>이메일</th>
                <th>관리자명</th>
              </tr>
            </thead>
            <tbody>
              {adminData.map((m) => (
                <tr key={m.memberNo}>
                  <td>{m.memberNo}</td>
                  <td>{m.memberEmail}</td>
                  <td>{m.memberNickname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
