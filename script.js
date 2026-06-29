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

saveBtn.onclick = () => {

  const plans = loadPlans();

  plans[selectedKey] = {

    member: memberInput.value,

    category: categoryInput.value,

    title: titleInput.value,

    time: timeInput.value,

    place: placeInput.value,

    link: linkInput.value,

    memo: memoInput.value

  };

  savePlans(plans);

  closeModal();

  renderCalendar();

};

// ===============================
// 削除
// ===============================

deleteBtn.onclick = () => {

  const plans = loadPlans();

  delete plans[selectedKey];

  savePlans(plans);

  closeModal();

  renderCalendar();

  planList.innerHTML =
    "日付をタップすると予定が表示されます";

};

// ===============================
// 下の予定カード
// ===============================

function showPlan(day){

  const plans = loadPlans();

  const k = key(
    new Date(
      current.getFullYear(),
      current.getMonth(),
      day
    )
  );

  selectedDate.textContent = `${day}日の予定`;

  if(!plans[k]){

    planList.innerHTML = `
      <div class="plan-card">
        <p>予定はありません</p>
      </div>
    `;

    return;

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
