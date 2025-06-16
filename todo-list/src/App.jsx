import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // 상태 관리
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoContent, setNewTodoContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 화면 상태 관리 (list: 목록화면, detail: 상세화면)
  const [currentView, setCurrentView] = useState("list");
  const [selectedTodo, setSelectedTodo] = useState(null);

  // 컴포넌트 마운트 시 TODO 목록 조회
  useEffect(() => {
    fetchTodos();
  }, []);

  // TODO 목록 조회 - axios 사용
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost/todo");
      setTodos(response.data);
    } catch (error) {
      console.error("TODO 조회 실패:", error);
    }
  };

  // TODO 추가 - axios 사용 (camelCase JSON)
  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === "" || newTodoContent.trim() === "") return;

    try {
      const response = await axios.post("http://localhost/todo", {
        todoTitle: newTodoTitle,
        todoContent: newTodoContent,
        complete: "N",
      });
      setTodos([...todos, response.data]);
      setNewTodoTitle("");
      setNewTodoContent("");
    } catch (error) {
      console.error("TODO 추가 실패:", error);
    }
  };

  // TODO 삭제 - axios 사용
  const handleDeleteTodo = async (todoNo) => {
    try {
      await axios.delete(`http://localhost/todo/${todoNo}`);
      setTodos(todos.filter((todo) => todo.todoNo !== todoNo));

      // 상세화면에서 삭제한 경우 목록으로 돌아가기
      if (currentView === "detail" && selectedTodo?.todoNo === todoNo) {
        setCurrentView("list");
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error("TODO 삭제 실패:", error);
    }
  };

  // TODO 완료 상태 토글 - axios 사용 (camelCase JSON)
  const handleToggleComplete = async (todoNo) => {
    try {
      const todo = todos.find((t) => t.todoNo === todoNo);
      const newCompleteStatus = todo.complete === "Y" ? "N" : "Y";

      await axios.put(`http://localhost/todo/${todoNo}/complete`, {
        complete: newCompleteStatus,
      });

      const updatedTodos = todos.map((todo) =>
        todo.todoNo === todoNo ? { ...todo, complete: newCompleteStatus } : todo
      );

      setTodos(updatedTodos);

      // 상세화면에서 상태 변경한 경우 selectedTodo도 업데이트
      if (currentView === "detail" && selectedTodo?.todoNo === todoNo) {
        setSelectedTodo({ ...selectedTodo, complete: newCompleteStatus });
      }
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
    }
  };

  // TODO 텍스트 수정 시작
  const startEditing = (todoNo, title, content) => {
    setEditingId(todoNo);
    setEditTitle(title);
    setEditContent(content);
  };

  // TODO 수정 완료 - axios 사용 (camelCase JSON)
  const handleUpdateTodo = async (todoNo) => {
    if (editTitle.trim() === "" || editContent.trim() === "") return;

    try {
      await axios.put(`http://localhost/todo/${todoNo}`, {
        todoTitle: editTitle,
        todoContent: editContent,
      });

      const updatedTodos = todos.map((todo) =>
        todo.todoNo === todoNo
          ? {
              ...todo,
              todoTitle: editTitle,
              todoContent: editContent,
            }
          : todo
      );

      setTodos(updatedTodos);

      // 상세화면에서 수정한 경우 selectedTodo도 업데이트
      if (currentView === "detail" && selectedTodo?.todoNo === todoNo) {
        setSelectedTodo({
          ...selectedTodo,
          todoTitle: editTitle,
          todoContent: editContent,
        });
      }

      setEditingId(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error("TODO 수정 실패:", error);
    }
  };

  // 제목 클릭 시 상세화면으로 이동
  const handleTitleClick = (todo) => {
    setSelectedTodo(todo);
    setCurrentView("detail");
  };

  // 목록으로 돌아가기
  const goBackToList = () => {
    setCurrentView("list");
    setSelectedTodo(null);
    setEditingId(null); // 수정 모드 해제
  };

  // 목록화면 렌더링
  const renderListView = () => (
    <div className="todo-container">
      <h1>TODO LIST</h1>

      {/* 할일 추가 폼 */}
      <div className="todo-input-section">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="todo-input title-input"
        />
        <textarea
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="todo-input content-input"
        />
        <button onClick={handleAddTodo} className="add-btn">
          추가
        </button>
      </div>

      {/* TODO 목록 - MAP으로 생성 */}
      <div className="todo-list">
        {todos.map((todo) => (
          <div
            key={todo.todoNo}
            className={`todo-item ${todo.complete === "Y" ? "completed" : ""}`}
          >
            {/* 완료 체크박스 */}
            <input
              type="checkbox"
              checked={todo.complete === "Y"}
              onChange={() => handleToggleComplete(todo.todoNo)}
              className="todo-checkbox"
            />

            <div className="todo-content">
              {/* 제목 클릭 시 상세화면으로 이동 */}
              <h3
                onClick={() => handleTitleClick(todo)}
                className="todo-title clickable"
                style={{
                  textDecoration:
                    todo.complete === "Y" ? "line-through" : "none",
                  color: todo.complete === "Y" ? "#888" : "#000",
                }}
              >
                {todo.todoTitle}
              </h3>
              <p className="todo-date">
                {new Date(todo.regDate).toLocaleString()}
              </p>
              <p className="todo-status">
                {todo.complete === "Y" ? "완료" : "진행중"}
              </p>
            </div>

            {/* 목록에서 바로 삭제 가능 */}
            <div className="todo-actions">
              <button
                onClick={() => handleDeleteTodo(todo.todoNo)}
                className="delete-btn"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 통계 */}
      <div className="todo-stats">
        <p>전체: {todos.length}개</p>
        <p>완료: {todos.filter((todo) => todo.complete === "Y").length}개</p>
        <p>남은 일: {todos.filter((todo) => todo.complete === "N").length}개</p>
      </div>
    </div>
  );

  // 상세화면 렌더링
  const renderDetailView = () => (
    <div className="todo-detail-container">
      {/* 헤더 - 뒤로가기 버튼 */}
      <div className="detail-header">
        <button onClick={goBackToList} className="back-btn">
          ← 목록으로
        </button>
        <h1>TODO 상세보기</h1>
      </div>

      {selectedTodo && (
        <div className="todo-detail">
          {/* 수정 모드 */}
          {editingId === selectedTodo.todoNo ? (
            <div className="edit-section">
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-input title-edit"
                  placeholder="제목"
                />
              </div>
              <div className="form-group">
                <label>내용</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-input content-edit"
                  placeholder="내용"
                  rows="10"
                />
              </div>
              <div className="edit-actions">
                <button
                  onClick={() => handleUpdateTodo(selectedTodo.todoNo)}
                  className="save-btn"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="cancel-btn"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-content">
              {/* 제목 */}
              <div className="detail-title-section">
                <h2>{selectedTodo.todoTitle}</h2>
                <span
                  className={`status-badge ${
                    selectedTodo.complete === "Y" ? "completed" : "pending"
                  }`}
                >
                  {selectedTodo.complete === "Y" ? "완료" : "진행중"}
                </span>
              </div>

              {/* 메타 정보 */}
              <div className="detail-meta">
                <p className="detail-date">
                  📅 등록일: {new Date(selectedTodo.regDate).toLocaleString()}
                </p>
                <p className="detail-id">🆔 TODO ID: {selectedTodo.todoNo}</p>
              </div>

              {/* 내용 */}
              <div className="detail-content-section">
                <h3>내용</h3>
                <div className="content-text">{selectedTodo.todoContent}</div>
              </div>

              {/* 액션 버튼들 */}
              <div className="detail-actions">
                <button
                  onClick={() => handleToggleComplete(selectedTodo.todoNo)}
                  className={`toggle-btn ${
                    selectedTodo.complete === "Y"
                      ? "mark-pending"
                      : "mark-complete"
                  }`}
                >
                  {selectedTodo.complete === "Y"
                    ? "미완료로 변경"
                    : "완료로 변경"}
                </button>
                <button
                  onClick={() =>
                    startEditing(
                      selectedTodo.todoNo,
                      selectedTodo.todoTitle,
                      selectedTodo.todoContent
                    )
                  }
                  className="edit-btn"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteTodo(selectedTodo.todoNo)}
                  className="delete-btn"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 현재 화면에 따라 렌더링
  return <>{currentView === "list" ? renderListView() : renderDetailView()}</>;
}

export default App;
