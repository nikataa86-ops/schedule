const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const planList = document.getElementById("planList");
const modal = document.getElementById("modal");

// メンバーカラー定義
const members = {
  ALL: { color: "#d1d5db" },
  SHORI: { color: "#fca5a5" },
  FUMA: { color: "#d8b4fe" },
  SO: { color: "#86efac" },
  TAKUTO: { color: "#93c5fd" },
  YOSHITAKA: { color: "#bef264" },
  MASAKI: { color: "#f9a8d4" },
  SHUTO: { color: "#fde68a" },
  TAIKI: { color: "#ffffff" },
  HIYOKO: { color: "#fff59d" }
};

let current = new Date();
let selectedKey = "";

// データの読み込み・保存
const loadPlans = () => JSON.parse(localStorage.getItem("plans") || "{}");
const savePlans = (data) => localStorage.setItem("plans", JSON.stringify(data));

// モーダル制御
function openModal(k) {
  selectedKey = k;
  modal.classList.remove("hidden");
}
function closeModal() { modal.classList.add("hidden"); }

// カレンダー表示更新
function renderCalendar() {
  calendar.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();
  monthTitle.textContent = `${year}年 ${month + 1}月`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const plans = loadPlans();

  for(let i=0; i<firstDay; i++) calendar.appendChild(document.createElement("div"));

  for(let day=1; day<=lastDate; day++){
    const k = `${year}-${month+1}-${day}`;
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<div class="day-number">${day}</div><div class="dot-wrap"></div>`;
    
    // 予定があればドットを表示
    if (plans[k]) {
      const dotWrap = cell.querySelector(".dot-wrap");
      plans[k].forEach(p => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.background = members[p.member]?.color || "#fff";
        dotWrap.appendChild(dot);
      });
    }

    cell.addEventListener("dblclick", () => {
      openModal(k);
      showPlan(k, day);
    });
    cell.addEventListener("click", () => showPlan(k, day));
    calendar.appendChild(cell);
  }
}

// 予定表示
function showPlan(key, day) {
  const plans = loadPlans();
  const dayPlans = plans[key] || [];
  document.getElementById("selectedDate").innerText = `${day}日の予定`;

  if (dayPlans.length === 0) {
    planList.innerHTML = `<div class="plan-card">予定はありません</div>`;
    return;
  }

  planList.innerHTML = dayPlans.map((p, index) => `
    <div class="plan-card">
      <div class="member-row">
        <span class="member-dot" style="background:${members[p.member]?.color}"></span>
        ${p.member}
      </div>
      <div class="plan-title">${p.title}</div>
      <div class="plan-category">${p.category}</div>
      ${p.time ? `<div class="plan-time">⏰ ${p.time}</div>` : ""}
    </div>
  `).join("");
}

// 保存ボタン
document.getElementById("saveBtn").addEventListener("click", () => {
  const plans = loadPlans();
  if (!plans[selectedKey]) plans[selectedKey] = [];

  const newData = {
    category: document.getElementById("category").value,
    member: document.getElementById("member").value,
    title: document.getElementById("titleInput").value,
    time: document.getElementById("timeInput").value,
    place: document.getElementById("placeInput").value,
    memo: document.getElementById("memoInput").value
  };

  plans[selectedKey].push(newData);
  savePlans(plans);
  renderCalendar();
  showPlan(selectedKey, selectedKey.split("-")[2]);
  closeModal();
});

// 前月・次月
document.getElementById("prevMonth").addEventListener("click", () => { current.setMonth(current.getMonth()-1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { current.setMonth(current.getMonth()+1); renderCalendar(); });
document.getElementById("closeBtn").addEventListener("click", closeModal);

renderCalendar();
