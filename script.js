// ======================================
// Timelesz Schedule v3
// ======================================

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const planList = document.getElementById("planList");
const selectedDate = document.getElementById("selectedDate");
const modal = document.getElementById("modal");

const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.getElementById("closeBtn");
const deleteBtn = document.getElementById("deleteBtn");

const memberInput = document.getElementById("member");
const categoryInput = document.getElementById("category");
const titleInput = document.getElementById("titleInput");
const timeInput = document.getElementById("timeInput");
const placeInput = document.getElementById("placeInput");
const linkInput = document.getElementById("linkInput");
const memoInput = document.getElementById("memoInput");

const members = {
    ALL: "#cbd5e1", SHORI: "#fca5a5", FUMA: "#d8b4fe", SO: "#86efac",
    TAKUTO: "#93c5fd", YOSHITAKA: "#bef264", MASAKI: "#f9a8d4",
    SHUTO: "#fde68a", TAIKI: "#f8fafc", HIYOKO: "#fff176"
};

let current = new Date();
let filter = "ALL";
let selectedKey = null;

function key(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function loadPlans() {
    return JSON.parse(localStorage.getItem("plans") || "{}");
}

function savePlans(data) {
    localStorage.setItem("plans", JSON.stringify(data));
}

function openModal(dateKey) {
    selectedKey = dateKey;
    // 新規追加時の入力クリア
    memberInput.value = "ALL";
    categoryInput.selectedIndex = 0;
    titleInput.value = "";
    timeInput.value = "";
    placeInput.value = "";
    linkInput.value = "";
    memoInput.value = "";
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

closeBtn.onclick = closeModal;

// カレンダー表示
function renderCalendar() {
    calendar.innerHTML = "";
    const year = current.getFullYear();
    const month = current.getMonth();
    monthTitle.textContent = `${year}年 ${month + 1}月`;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const plans = loadPlans();

    for (let i = 0; i < firstDay; i++) calendar.appendChild(document.createElement("div"));

    for (let day = 1; day <= lastDate; day++) {
        const cell = document.createElement("div");
        cell.className = "day";
        cell.innerHTML = `<div class="day-number">${day}</div>`;
        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) cell.classList.add("today");

        const k = key(new Date(year, month, day));
        if (plans[k]) {
            plans[k].forEach(p => {
                if (filter === "ALL" || p.member === filter) {
                    cell.classList.add("border-" + p.member);
                    const dot = document.createElement("div");
                    dot.className = "dot";
                    dot.style.background = members[p.member];
                    cell.appendChild(dot);
                }
            });
        }
        cell.onclick = () => { showPlan(day); };
        cell.ondblclick = () => { openModal(k); };
        calendar.appendChild(cell);
    }
}

// 保存ボタン
saveBtn.onclick = () => {
    const plans = loadPlans();
    if (!Array.isArray(plans[selectedKey])) plans[selectedKey] = [];
    plans[selectedKey].push({
        member: memberInput.value,
        category: categoryInput.value,
        title: titleInput.value,
        time: timeInput.value,
        place: placeInput.value,
        link: linkInput.value,
        memo: memoInput.value
    });
    savePlans(plans);
    closeModal();
    renderCalendar();
    showPlan(new Date(selectedKey).getDate());
};

// 削除
deleteBtn.onclick = () => {
    const plans = loadPlans();
    delete plans[selectedKey];
    savePlans(plans);
    closeModal();
    renderCalendar();
    planList.innerHTML = "日付をタップすると予定が表示されます";
};

// 予定表示
function showPlan(day) {
    const plans = loadPlans();
    const k = key(new Date(current.getFullYear(), current.getMonth(), day));
    selectedKey = k;
    const dayPlans = plans[k] || [];
    selectedDate.textContent = `${day}日の予定`;

    if (dayPlans.length === 0) {
        planList.innerHTML = `<div class="plan-card"><p>予定はありません</p></div>`;
        return;
    }

    planList.innerHTML = dayPlans.map(p => `
        <div class="plan-card" style="margin-bottom:10px; border-left: 5px solid ${members[p.member]}">
            <div class="member-row">
                <span class="member-dot" style="background:${members[p.member]}"></span>
                <strong>${p.member}</strong>
            </div>
            <p><strong>${p.category}</strong></p>
            <p>${p.title}</p>
            ${p.time ? `<p>🕒 ${p.time}</p>` : ""}
        </div>
    `).join("");
}

// 以下は月送りやフィルターなどの既存機能（変更なし）
document.getElementById("prevMonth").onclick = () => { current.setMonth(current.getMonth() - 1); renderCalendar(); };
document.getElementById("nextMonth").onclick = () => { current.setMonth(current.getMonth() + 1); renderCalendar(); };

// 初期表示
renderCalendar();
