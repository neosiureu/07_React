import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosAPI";

/* 서버에서 받을 데이터 =>변화를 일으켜야 한다 => 뭐를 받을까? */

export default function Restore() {
  const [withdrawnMembers, setWithdrawnMembers] = useState(null);

  const [deleteBoards, setDeleteBoards] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // 1) 탈퇴한 회원 목록 조회용 함수

  const getWithdrawnMemberList = async () => {
    try {
      const resp = await axiosApi.get("/admin/withdrawnMemberList");
      console.log(resp.data);

      if (resp.status === 200) {
        setWithdrawnMembers(resp.data);
      }
    } catch (error) {
      console.log("탈퇴회원 목록 조회 중 에러 발생 :", error);
    }
  };

  // + 탈퇴한 회원 복구 요청 함수  getWithdrawnMemberList를 다시 호출해야 함

  const restoreMember = async (member) => {
    // 복구요청
    // 복구되었다고 응답 옴
    // 목록을 리랜더링해야 함 => 부모에 주는 편이 나음
    if (
      window.confirm(member.memberNickname + "님을 탈퇴에서 복구시키겠습니까?")
    ) {
      try {
        const resp = await axiosApi.put("admin/restoreMember", {
          memberNo: member.memberNo,
        });
        if (resp.status === 200) {
          alert("복구되었습니다!");
          getWithdrawnMemberList();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 2) 삭제된 게시글 목록 조회용 함수

  const getDeleteBoardList = async () => {
    try {
      const resp = await axiosApi.get("/admin/deleteBoardList");

      console.log(resp.data);
      if (resp.status === 200) {
        setDeleteBoards(resp.data);
      }
    } catch (error) {
      console.log("삭제 게시글 목록 조회 중 에러 발생 :", error);
    }
  };
  // + 삭제된 게시글 복구 요청 함수

  const restoreBoard = async (board) => {
    // 복구요청
    // 복구되었다고 응답 옴
    // 목록을 리랜더링해야 함 => 부모에 주는 편이 나음
    if (
      window.confirm(board.boardNo + "라는 글을 삭제에서 복원시키겠습니까?")
    ) {
      try {
        const resp = await axiosApi.put("/admin/restoreBoard", {
          boardNo: board.boardNo,
        });
        if (resp.status === 200) {
          alert("복구되었습니다!");
          getDeleteBoardList();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Restore라는 컴포넌트가 화면에 처음 랜더링될 때 수행시킬 훅 useEffect
  // 랜더링 되면 목록 조회 함수를 수행
  useEffect(() => {
    getWithdrawnMemberList();
    getDeleteBoardList();
  }, []);

  // 진짜 랜더링 됐으면 = withdrawnMembers 또는 deleteBoards상태가 변경될 때 isLoading 값 변경을 실행

  useEffect(() => {
    if (withdrawnMembers != null && deleteBoards != null) {
      setIsLoading(false);
    }
  }, [withdrawnMembers, deleteBoards]);

  if (isLoading) {
    return <h1>LODAING...</h1>;
  } else {
    return (
      <div className="menu-box">
        <RestoreMember
          withdrawnMembers={withdrawnMembers}
          restoreMember={restoreMember}
        />
        <RestoreBoard deleteBoards={deleteBoards} restoreBoard={restoreBoard} />
      </div>
    );
  }
}

const RestoreMember = ({ withdrawnMembers, restoreMember }) => {
  return (
    <section className="section-border">
      <h2>탈퇴 회원 복구</h2>

      <h3>탈퇴한 회원 목록</h3>
      {withdrawnMembers.length === 0 ? (
        <p>탈퇴한 회원이 없습니다.</p>
      ) : (
        // 반복되는 ul태그 할 때는 index가 키로 들어가곤 함
        withdrawnMembers.map((member, index) => {
          // 중괄호 안에서는 반드시 리턴이 있어야 함 => ul등이 있어도 화면이 아예 안 뜸 (시험에 나옴)
          return (
            <ul className="ul-board" key={index}>
              <li>회원 번호: {member.memberNo}</li>
              <li>회원 이메일: {member.memberEmail}</li>
              <li>회원 닉네임: {member.memberNickname}</li>
              {/* // { 전달할 데이터가 있음} */}
              <button
                className="restoreBtn"
                onClick={() => restoreMember(member)}
              >
                복구하기
              </button>
            </ul>
          );
        })
      )}
    </section>
  );
};

// 상태값 null = 아직 서버에 요청을 보내지도 않았을 때
// 상태값 [] = 서버에서 돌아오긴 왔는데 아무 데이터도 없을 때
// 상태값[요소] = 서버에서 돌아왔으며 데이터도 있음

const RestoreBoard = ({ deleteBoards, restoreBoard }) => {
  return (
    <section className="section-border">
      <h2>삭제 게시글 복구</h2>

      <h3>삭제된 게시글 목록</h3>
      {deleteBoards.length === 0 ? (
        <p>삭제된 게시글이 없습니다</p>
      ) : (
        deleteBoards.map((board, index) => (
          <ul className="ul-board" key={index}>
            <li>게시글번호: {board.boardNo}</li>
            <li>게시글 카테고리 이름: {board.boardName}</li>
            <li>게시글 제목: {board.boardTitle}</li>
            <li>게시글 작성자 닉네임: {board.memberNickname}</li>
            <button className="restoreBtn" onClick={() => restoreBoard(board)}>
              복구
            </button>
          </ul>
        ))
      )}
    </section>
  );
};
