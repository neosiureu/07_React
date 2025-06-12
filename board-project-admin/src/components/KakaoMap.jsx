import React, { useCallback, useEffect, useRef, useState } from "react";

export default function KakaoMap() {
  /* refs & state */
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const events = useRef([]);
  const timerId = useRef(null);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState(3);

  /* util */
  const log = (m) => {
    console.log(m);
    setLogs((p) => [...p, `${new Date().toLocaleTimeString()}: ${m}`]);
  };

  /* SDK load */
  const loadSDK = () =>
    new Promise((ok, no) => {
      if (window.kakao && window.kakao.maps) return ok();
      const s = document.createElement("script");
      s.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=0b488a640e9c024b76437b2415c4dc86&autoload=false&libraries=services";
      s.onload = ok;
      s.onerror = () => no(new Error("SDK load fail"));
      document.head.appendChild(s);
    });

  /* 서버 API 호출 */
  const fetchServer = async (body) => {
    log(`🔍 POST /api/search  ${JSON.stringify(body)}`);
    const res = await fetch("http://localhost/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    log(`response status = ${res.status}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json(); // { total, sample }
  };

  const searchBounds = useCallback(async () => {
    const map = mapObj.current;
    if (!map || !selected) return;

    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const body = {
      sw: { lat: sw.getLat(), lng: sw.getLng() },
      ne: { lat: ne.getLat(), lng: ne.getLng() },
      keyword: selected,
    };

    try {
      const data = await fetchServer(body);
      setCount(data.total);
      log(` 결과 ${data.total}개`);
    } catch (e) {
      setError(e.message);
      log(` 실패: ${e.message}`);
    }
  }, [selected]);

  /* debounce */
  const debounceSearch = useCallback(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(searchBounds, 400);
  }, [searchBounds]);

  /* 지도 이벤트 등록 helpers */
  const addEvt = (t, type, fn) => {
    window.kakao.maps.event.addListener(t, type, fn);
    events.current.push({ t, type, fn });
  };
  const clearEvts = () => {
    events.current.forEach(({ t, type, fn }) =>
      window.kakao.maps.event.removeListener(t, type, fn)
    );
    events.current = [];
  };

  /* 카테고리 버튼 */
  const handleSelect = (name) => {
    console.log("CLICK", name);
    clearEvts();
    if (name === selected) {
      setSelected(null);
      setCount(0);
      return;
    }
    setSelected(name); // state 만 변경
  };

  /* selected 변경 → 검색 */
  useEffect(() => {
    if (!selected) return;
    searchBounds(); // 최초 1회

    const map = mapObj.current;
    if (!map) return;

    addEvt(map, "zoom_changed", () => {
      setLevel(map.getLevel());
      debounceSearch();
    });
    addEvt(map, "dragend", debounceSearch);

    return clearEvts; // cleanup
  }, [selected, searchBounds, debounceSearch]);

  /* 지도 초기화 */
  useEffect(() => {
    loadSDK()
      .then(() =>
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          });
          mapObj.current = map;
          setStatus("success");
          log("지도 생성 완료!!!");
        })
      )
      .catch((e) => {
        setError(e.message);
        setStatus("error");
      });

    return () => {
      clearEvts();
      mapObj.current = null;
    };
  }, []);

  /* UI 데이터 */
  const categories = [
    { name: "카페", icon: "☕", color: "#8B4513" },
    { name: "병원", icon: "🏥", color: "#E53E3E" },
    { name: "학교", icon: "🏫", color: "#3182CE" },
    { name: "마트", icon: "🛒", color: "#38A169" },
    { name: "은행", icon: "🏦", color: "#805AD5" },
    { name: "약국", icon: "💊", color: "#D69E2E" },
  ];

  /* render */
  return (
    <div
      style={{
        padding: 20,
        width: "100%", // 전체 폭
        margin: "0 auto",
      }}
    >
      {" "}
      <h2>🗺️ 카카오 지도 – 서버 집계</h2>
      {status === "loading" && <p>🔄 SDK 로드 중…</p>}
      {status === "error" && <p style={{ color: "red" }}> {error}</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {categories.map(({ name, icon, color }) => (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: `2px solid ${color}`,
              background: selected === name ? color : "#fff",
              color: selected === name ? "#fff" : color,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span>{icon}</span> {name}
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ marginBottom: 15 }}>
          <h3>
            {selected} : {count}개 (level {level})
          </h3>
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "70vh",
          minHeight: 600,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      />
      <details style={{ marginTop: 20 }}>
        <summary style={{ cursor: "pointer" }}> 로그 {logs.length}</summary>
        <div
          style={{
            maxHeight: 300,
            overflow: "auto",
            fontSize: 12,
            background: "#f5f5f5",
            padding: 10,
          }}
        >
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </details>
    </div>
  );
}
