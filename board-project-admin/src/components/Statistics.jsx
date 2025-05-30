import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosAPI";

export default function Statistics() {
  const [readCountData, setReadCountData] = useState(null);
  const [likeCountData, setLikeCountData] = useState(null);
  const [commentCountData, setCommentCountData] = useState(null);
  const [newMemberData, setNewMemberData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // 밖으로 뺀 함수들
  const getMaxReadCount = async (setData) => {
    try {
      const resp = await axiosApi.get("/admin/maxReadCount");
      console.log(resp.data);
      if (resp.status === 200) setData(resp.data);
    } catch (error) {
      console.log("최대 조회수 게시글 조회 중 예외 발생:");
    }
  };

  const getMaxLikeCount = async (setData) => {
    try {
      const resp = await axiosApi.get("/admin/maxLikeCount");
      console.log(resp.data);
      if (resp.status === 200) setData(resp.data);
    } catch (error) {
      console.log("최대 좋아요 게시글 조회 중 예외 발생:");
    }
  };

  const getMaxCommentCount = async (setData) => {
    try {
      const resp = await axiosApi.get("/admin/maxCommentCount");
      console.log(resp.data);
      if (resp.status === 200) setData(resp.data);
    } catch (error) {
      console.log("최대 댓글 게시글 조회 중 예외 발생:");
    }
  };

  const getNewMemberData = async (setData) => {
    try {
      const resp = await axiosApi.get("/admin/newMember");
      console.log(resp.data);
      if (resp.status === 200) setData(resp.data);
    } catch (error) {
      console.log("새 멤버 조회 중 예외 발생:");
    }
  };

  // useEffect 내부에서 호출
  useEffect(
    () => {
      const fetchData = async () => {
        await Promise.all([
          getMaxReadCount(setReadCountData),
          getMaxLikeCount(setLikeCountData),
          getMaxCommentCount(setCommentCountData),
          getNewMemberData(setNewMemberData),
        ]);
      };
      fetchData();
    },
    [
      // 비어있다 = 컴포넌트가 처음 마운트될 때 딱 한번만 실행되는 userEffect
    ]
  ); // 랜더링 시 요청만 보내지고 응답은 아직 없을 수 있음

  // 지금부터는 readCountData, likeCountData, commentCountData에 변화가 감지될 때
  useEffect(() => {
    if (
      readCountData != null &&
      likeCountData != null &&
      commentCountData != null &&
      newMemberData != null
    ) {
      setIsLoading(false);
    }
  }, [readCountData, likeCountData, commentCountData, newMemberData]);

  // 셋 다 변경될떄만 isLoding을 false로

  // statistics 컴포넌트가 화면에 마운트될 때 서버로 세가지 데이터를 요청 => 응답받아야 함
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  const newMemberCount = newMemberData.length;

  return (
    <div>
      <h2>신규 가입 회원 {newMemberCount} 명</h2>
      <h3>[ 7일 이내 가입 회원 ]</h3>
      <table>
        <thead>
          <tr>
            <th>회원번호</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {newMemberData.map((member) => (
            <tr>
              <td>{member.memberNo}</td>
              <td>{member.memberEmail}</td>
              <td>{member.memberNickname}</td>
              <td>{member.enrollDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="statistics-section">
        <h2>가장 조회수 많은 게시글</h2>
        <p>게시판종류: {readCountData.boardName}</p>
        <p>게시글 번호: No.{readCountData.boardNo}</p>
        <p>게시글 제목: {readCountData.boardTitle} </p>
        <p>게시글조회수: {readCountData.readCount}</p>
        <p>작성자 닉네임: {readCountData.memberNickname}</p>
      </section>

      <section className="statistics-section">
        <h2>가장 좋아요 많은 게시글</h2>
        <p>게시판종류: {likeCountData.boardName} </p>
        <p>게시글 번호No.{likeCountData.boardNo}</p>
        <p>
          {" "}
          게시글 제목:
          {likeCountData.boardTitle}{" "}
        </p>
        <p>게시글좋아요: {likeCountData.likeCount}</p>
        <p>작성자 닉네임: {likeCountData.memberNickname}</p>
      </section>

      <section className="statistics-section">
        <h2>가장 댓글 많은 게시글</h2>
        <p>게시판종류: {commentCountData.boardName} </p>
        <p>게시글 번호No.{commentCountData.boardNo}</p>
        <p>
          {" "}
          게시글 제목:
          {commentCountData.boardTitle}{" "}
        </p>
        <p>댓글 수 : {commentCountData.commentCount}</p>
        <p>작성자 닉네임: {commentCountData.memberNickname}</p>
      </section>
    </div>
  );
}

// 과제: 신규 가입 데이터
