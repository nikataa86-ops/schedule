// ======================================
// Timelesz Schedule v2
// script.js
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

ALL:"#cbd5e1",

SHORI:"#fca5a5",

FUMA:"#d8b4fe",

SO:"#86efac",

TAKUTO:"#93c5fd",

YOSHITAKA:"#bef264",

MASAKI:"#f9a8d4",

SHUTO:"#fde68a",

TAIKI:"#f8fafc",

HIYOKO:"#fff176"

};

let current=new Date();

let filter="ALL";

let selectedKey=null;

function key(date){

return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

}

function loadPlans(){

return JSON.parse(localStorage.getItem("plans")||"{}");

}

function savePlans(data){

localStorage.setItem("plans",JSON.stringify(data));

}

function openModal(dateKey){

selectedKey=dateKey;

const plans=loadPlans();

const old=plans[dateKey];

if(old){

memberInput.value=old.member;

categoryInput.value=old.category;

titleInput.value=old.title;

timeInput.value=old.time;

placeInput.value=old.place;

linkInput.value=old.link;

memoInput.value=old.memo;

}else{

memberInput.value="ALL";

categoryInput.selectedIndex=0;

titleInput.value="";

timeInput.value="";

placeInput.value="";

linkInput.value="";

memoInput.value="";

}

modal.classList.remove("hidden");

}

function closeModal(){

modal.classList.add("hidden");

}

closeBtn.onclick=closeModal;

function renderCalendar(){

calendar.innerHTML="";

const year=current.getFullYear();

const month=current.getMonth();

monthTitle.textContent=`${year}年 ${month+1}月`;

const firstDay=new Date(year,month,1).getDay();

const lastDate=new Date(year,month+1,0).getDate();

const today=new Date();

const plans=loadPlans();

for(let i=0;i<firstDay;i++){

const blank=document.createElement("div");

calendar.appendChild(blank);

}

for(let day=1;day<=lastDate;day++){

const cell=document.createElement("div");

cell.className="day";

const number=document.createElement("div");

number.className="day-number";

number.textContent=day;

cell.appendChild(number);

if(

today.getFullYear()===year&&

today.getMonth()===month&&

today.getDate()===day

){

cell.classList.add("today");

}

const k=key(new Date(year,month,day));

if(plans[k]){

const p=plans[k];

if(filter==="ALL"||p.member===filter){

cell.classList.add("border-"+p.member);

const dot=document.createElement("div");

dot.className="dot";

dot.style.background=members[p.member];

cell.appendChild(dot);

}

}

cell.onclick=()=>{

openModal(k);

showPlan(day);

};

calendar.appendChild(cell);

}

}

// ===============================
// 保存
// ===============================

// --- 保存ボタンのロジックを以下に書き換え ---
saveBtn.onclick = () => {
  const plans = loadPlans();
  
  // 1. 配列でなければ初期化
  if (!Array.isArray(plans[selectedKey])) {
    plans[selectedKey] = [];
  }

// ===============================
// 削除機能（もし無ければここに追加）
// ===============================
deleteBtn.onclick = () => {
  const plans = loadPlans();
  delete plans[selectedKey];
  savePlans(plans);
  closeModal();
  renderCalendar();
  planList.innerHTML = "日付をタップすると予定が表示されます";
};

  // 2. 新しいデータを作成
  const newData = {
    member: memberInput.value,
    category: categoryInput.value,
    title: titleInput.value,
    time: timeInput.value,
    place: placeInput.value,
    link: linkInput.value,
    memo: memoInput.value
  };

  // 3. 配列に追加（※編集機能を実装するなら、ここでインデックスの判定を入れます）
  plans[selectedKey].push(newData);
  
  savePlans(plans);
  closeModal();
  renderCalendar();
  // 今日の日付を取得して表示更新
  const d = new Date(selectedKey).getDate();
  showPlan(d);
};

// --- showPlan 関数を以下に書き換え（複数表示対応） ---
function showPlan(day) {
  const plans = loadPlans();
  const k = key(new Date(current.getFullYear(), current.getMonth(), day));
  const dayPlans = plans[k] || [];

  selectedDate.textContent = `${day}日の予定`;

  if (dayPlans.length === 0) {
    planList.innerHTML = `<div class="plan-card"><p>予定はありません</p></div>`;
    return;
  }

  // 配列の中身をループして表示
  planList.innerHTML = dayPlans.map((p, index) => `
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

  const p = plans[k];

  const color = members[p.member];

  planList.innerHTML = `

    <div class="plan-card">

      <div class="member-row">

        <span
          class="member-dot"
          style="background:${color}">
        </span>

        <strong>${p.member}</strong>

      </div>

      <p><strong>${p.category}</strong></p>

      <p>${p.title}</p>

      ${p.time ? `<p>🕒 ${p.time}</p>` : ""}

      ${p.place ? `<p>📍 ${p.place}</p>` : ""}

      ${p.link ? `
      <p>
        🔗
        <a href="${p.link}"
           target="_blank">
           リンクを開く
        </a>
      </p>` : ""}

      ${p.memo ? `<p>${p.memo}</p>` : ""}

    </div>

  `;

}

// ===============================
// 月送り
// ===============================

document
.getElementById("prevMonth")
.onclick = () => {

  current.setMonth(
    current.getMonth()-1
  );

  renderCalendar();

};

document
.getElementById("nextMonth")
.onclick = () => {

  current.setMonth(
    current.getMonth()+1
  );

  renderCalendar();

};

// ===============================
// メンバーフィルター
// ===============================

document
.querySelectorAll(".member-filter button")
.forEach(button=>{

  button.onclick=()=>{

    document
    .querySelectorAll(".member-filter button")
    .forEach(btn=>btn.classList.remove("active"));

    button.classList.add("active");

    filter=button.dataset.member;

    renderCalendar();

    planList.innerHTML=
      "日付をタップすると予定が表示されます";

  };

});

// ===============================
// モーダル外タップで閉じる
// ===============================

modal.addEventListener("click",(e)=>{

  if(e.target===modal){

    closeModal();

  }

});

// ===============================
// ESCキーで閉じる
// ===============================

document.addEventListener("keydown",(e)=>{

  if(e.key==="Escape"){

    closeModal();

  }

});

// ===============================
// 今日へ戻る（ダブルタップ）
// ===============================

monthTitle.addEventListener("dblclick",()=>{

  current=new Date();

  renderCalendar();

});

// ===============================
// 初期表示
// ===============================

renderCalendar();

// ALLを最初から選択状態

document
.querySelector('[data-member="ALL"]')
.classList.add("active");

// 初期メッセージ

planList.innerHTML=`

<div class="plan-card">

<h3>📅 Timelesz Schedule</h3>

<p>

日付をタップすると予定を追加・編集できます。

</p>

</div>

`;
