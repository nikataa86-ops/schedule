const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const planList = document.getElementById("planList");
const modal = document.getElementById("modal");

const members = {
  ALL: { color: "#d1d5db" }, SHORI: { color: "#fda4af" }, FUMA: { color: "#c4b5fd" },
  SO: { color: "#86efac" }, TAKUTO: { color: "#93c5fd" }, YOSHITAKA: { color: "#bef264" },
  MASAKI: { color: "#f9a8d4" }, SHUTO: { color: "#fde68a" }, TAIKI: { color: "#ffffff" },
  HIYOKO: { color: "#fff59d" }
};

let current = new Date();
let selectedKey = "";
let currentMember = "ALL";
let editingIndex = -1;

const loadPlans = () => JSON.parse(localStorage.getItem("plans") || "{}");
const savePlans = (data) => localStorage.setItem("plans", JSON.stringify(data));

// メンバー選択ボタンを生成
const memberSelector = document.getElementById("memberSelector");
Object.keys(members).forEach(m => {
  const btn = document.createElement("button");
  btn.className = "member-btn";
  btn.style.backgroundColor = members[m].color;
  btn.onclick = () => {
    currentMember = m;
    document.querySelectorAll('.member-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
  memberSelector.appendChild(btn);
});

function openModal(k, index = -1) {
  selectedKey = k;
  editingIndex = index;
  modal.classList.remove("hidden");
}

function closeModal() { modal.classList.add("hidden"); }

function getCategoryIcon(cat) {
  const icons = { tv: "📺", radio: "📻", stage: "🎭", movie: "🎬", stream: "📱", fc: "💌", hiyoko: "🐥", magazine: "📖", birthday: "🎂", debut: "🏷️", notice: "📢", event: "🎉" };
  return icons[cat] || "📅";
}

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
    cell.className = `day ${k === new Date().toISOString().split('T')[0] ? 'today' : ''}`;
    cell.innerHTML = `<div class="day-number">${day}</div><div class="dot-wrap"></div>`;
    
    if (plans[k]) {
      plans[k].forEach(p => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.background = members[p.member]?.color;
        cell.querySelector(".dot-wrap").appendChild(dot);
      });
    }
    cell.addEventListener("click", () => showPlan(k, day));
    cell.addEventListener("dblclick", () => openModal(k));
    calendar.appendChild(cell);
  }
}

function showPlan(key, day) {
  const plans = loadPlans();
  const dayPlans = plans[key] || [];
  document.getElementById("selectedDate").innerText = `${day}日の予定`;
  
  planList.innerHTML = dayPlans.length ? dayPlans.map((p, i) => `
    <div class="plan-item" onclick="openModal('${key}', ${i})">
      <div class="plan-icon">${getCategoryIcon(p.category)}</div>
      <div class="plan-info">
        <div class="plan-title">${p.title}</div>
        <div class="plan-time">${p.time ? p.time + " " : ""} ${p.place || ""}</div>
      </div>
      <div class="member-tag" style="background:${members[p.member]?.color}33">
        ${p.member}
      </div>
    </div>
  `).join("") : `<div class="plan-card">予定はありません</div>`;
}

document.getElementById("saveBtn").addEventListener("click", () => {
  const plans = loadPlans();
  if (!plans[selectedKey]) plans[selectedKey] = [];
  const newData = {
    category: document.getElementById("category").value,
    member: currentMember,
    title: document.getElementById("titleInput").value,
    time: document.getElementById("timeInput").value,
    place: document.getElementById("placeInput").value,
    memo: document.getElementById("memoInput").value
  };
  
  if (editingIndex >= 0) plans[selectedKey][editingIndex] = newData;
  else plans[selectedKey].push(newData);
  
  savePlans(plans);
  renderCalendar();
  showPlan(selectedKey, selectedKey.split("-")[2]);
  closeModal();
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  const plans = loadPlans();
  if (editingIndex >= 0) plans[selectedKey].splice(editingIndex, 1);
  savePlans(plans);
  renderCalendar();
  closeModal();
});

document.getElementById("prevMonth").addEventListener("click", () => { current.setMonth(current.getMonth()-1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { current.setMonth(current.getMonth()+1); renderCalendar(); });
document.getElementById("closeBtn").addEventListener("click", closeModal);

renderCalendar();
