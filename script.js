// ========================================
// Timelesz Schedule Ver.3
// script.js Part1
// ========================================

const calendar=document.getElementById("calendar");
const monthTitle=document.getElementById("monthTitle");
const planList=document.getElementById("planList");
const selectedDate=document.getElementById("selectedDate");

const modal=document.getElementById("modal");

const saveBtn=document.getElementById("saveBtn");
const deleteBtn=document.getElementById("deleteBtn");
const closeBtn=document.getElementById("closeBtn");

const memberInput=document.getElementById("member");
const categoryInput=document.getElementById("category");
const titleInput=document.getElementById("titleInput");
const timeInput=document.getElementById("timeInput");
const placeInput=document.getElementById("placeInput");
const linkInput=document.getElementById("linkInput");
const memoInput=document.getElementById("memoInput");

const members={

ALL:"#d1d5db",

SHORI:"#fca5a5",

FUMA:"#d8b4fe",

SO:"#86efac",

TAKUTO:"#93c5fd",

YOSHITAKA:"#bef264",

MASAKI:"#f9a8d4",

SHUTO:"#fde68a",

TAIKI:"#ffffff",

HIYOKO:"#fff59d"

};

let current=new Date();

let filter="ALL";

let selectedKey="";

let editIndex=-1;

function key(date){

return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

}

function loadPlans(){

return JSON.parse(localStorage.getItem("plans")||"{}");

}

function savePlans(data){

localStorage.setItem("plans",JSON.stringify(data));

}

function openModal(dateKey,index=-1){

selectedKey=dateKey;

editIndex=index;

const plans=loadPlans();

const list=plans[dateKey]||[];

if(index>=0){

const p=list[index];

memberInput.value=p.member;

categoryInput.value=p.category;

titleInput.value=p.title;

timeInput.value=p.time;

placeInput.value=p.place;

linkInput.value=p.link;

memoInput.value=p.memo;

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

calendar.appendChild(document.createElement("div"));

}

for(let day=1;day<=lastDate;day++){

const cell=document.createElement("div");

cell.className="day";

const number=document.createElement("div");

number.className="day-number";

number.textContent=day;

cell.appendChild(number);

if(

today.getFullYear()==year&&

today.getMonth()==month&&

today.getDate()==day

){

cell.classList.add("today");

}

const k=key(new Date(year,month,day));

const list=plans[k]||[];
    // ---------- メンカラ丸表示 ----------

if(list.length){

    const dotWrap=document.createElement("div");

    dotWrap.className="dot-wrap";

    const used=[];

    list.forEach(plan=>{

        if(filter!=="ALL" && plan.member!==filter) return;

        if(used.includes(plan.member)) return;

        used.push(plan.member);

        const dot=document.createElement("div");

        dot.className="dot";

        dot.style.background=members[plan.member];

        dotWrap.appendChild(dot);

    });

    if(used.length){

        cell.classList.add("border-"+used[0]);

        cell.appendChild(dotWrap);

    }

}

cell.addEventListener("click",()=>{

    showPlan(day);

});

calendar.appendChild(cell);

}

}

// ---------- 下の予定一覧 ----------

function showPlan(day){

const plans=loadPlans();

const k=key(

new Date(

current.getFullYear(),

current.getMonth(),

day

)

);

selectedDate.textContent=`${day}日の予定`;

const list=plans[k]||[];

if(list.length===0){

planList.innerHTML=`

<div class="plan-card">

予定はありません

<br><br>

<button id="addPlan">

＋予定を追加

</button>

</div>

`;

document.getElementById("addPlan").onclick=()=>{

openModal(k);

};

return;

}

let html="";

list.forEach((p,index)=>{

if(filter!=="ALL" && p.member!==filter) return;

html+=`

<div class="plan-card">

<div class="member-row">

<span

class="member-dot"

style="background:${members[p.member]}">

</span>

<strong>${p.member}</strong>

</div>

<div class="plan-title">

${p.title}

</div>

<div class="plan-category">

${p.category}

</div>

${p.time?`<div class="plan-time">🕒 ${p.time}</div>`:""}

${p.place?`<div class="plan-place">📍 ${p.place}</div>`:""}

${p.link?`<div class="plan-link"><a href="${p.link}" target="_blank">🔗 リンクを開く</a></div>`:""}

${p.memo?`<div class="plan-memo">${p.memo}</div>`:""}

<br>

<button class="editPlan"

data-index="${index}">

✏️ 編集

</button>

</div>

`;

});

html+=`

<button id="addPlan">

＋予定を追加

</button>

`;

planList.innerHTML=html;

const addBtn=document.getElementById("addPlan");

if(addBtn){

addBtn.onclick=()=>{

openModal(k);

};

}

} // ← showPlan()終了
// ---------- 保存 ----------
saveBtn.onclick = () => {

const plans = loadPlans();

if(!plans[selectedKey]){
    plans[selectedKey]=[];
}

const data={

    member:memberInput.value,
    category:categoryInput.value,
    title:titleInput.value,
    time:timeInput.value,
    place:placeInput.value,
    link:linkInput.value,
    memo:memoInput.value

};

if(editIndex>=0){

    plans[selectedKey][editIndex]=data;

}else{

    plans[selectedKey].push(data);

}

savePlans(plans);

closeModal();

renderCalendar();

const d=Number(selectedKey.split("-")[2]);

showPlan(d);

});

// ---------- 削除 ----------

deleteBtn.onclick = () => {

if(editIndex<0){

closeModal();

return;

}

const plans=loadPlans();

plans[selectedKey].splice(editIndex,1);

if(plans[selectedKey].length===0){

delete plans[selectedKey];

}

savePlans(plans);

closeModal();

renderCalendar();

const d=Number(selectedKey.split("-")[2]);

showPlan(d);

});

// ---------- 編集ボタン ----------

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("editPlan")){

const index=Number(e.target.dataset.index);

openModal(selectedKey,index);

}

if(e.target.id==="addPlan"){

openModal(selectedKey);

}

});

// ---------- 前月 ----------

document.getElementById("prevMonth").addEventListener("click",()=>{

current.setMonth(current.getMonth()-1);

renderCalendar();

planList.innerHTML="日付をタップすると予定が表示されます";

});

// ---------- 次月 ----------

document.getElementById("nextMonth").addEventListener("click",()=>{

current.setMonth(current.getMonth()+1);

renderCalendar();

planList.innerHTML="日付をタップすると予定が表示されます";

});

// ---------- Today ----------

document.getElementById("todayBtn").addEventListener("click",()=>{

current=new Date();

renderCalendar();

});

// ---------- モーダル外 ----------

modal.addEventListener("click",(e)=>{

if(e.target===modal){

closeModal();

}

});

// ---------- ESC ----------

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

closeModal();

}

});

// ---------- フィルター ----------

document.querySelectorAll(".member-filter button").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".member-filter button")

.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

filter=btn.dataset.member;

renderCalendar();

planList.innerHTML=`
<div class="plan-card">
フィルター：
<strong>${filter}</strong>
</div>
`;

});

});

// ---------- 初期表示 ----------

renderCalendar();

document
.querySelector('[data-member="ALL"]')
.classList.add("active");

planList.innerHTML=`
<div class="plan-card">
<h3>Timelesz Schedule</h3>
<p>
日付をタップすると予定を追加できます。
</p>
</div>
`;
    // ========================================
// LINKボタン（変更してOK）
// ========================================

document.getElementById("fcLink").href =
"https://familyclub.jp/";

document.getElementById("ytLink").href =
"https://www.youtube.com/";

document.getElementById("instaLink").href =
"https://www.instagram.com/";

document.getElementById("tiktokLink").href =
"https://www.tiktok.com/";

document.getElementById("xLink").href =
"https://x.com/";

document.getElementById("lineLink").href =
"https://line.me/";

// ========================================
// 日付ダブルタップで予定追加
// ========================================

let lastTap = 0;

calendar.addEventListener("click",(e)=>{

const dayCell=e.target.closest(".day");

if(!dayCell) return;

const now=Date.now();

if(now-lastTap<300){

const day=Number(
dayCell.querySelector(".day-number").textContent
);

const k=key(
new Date(
current.getFullYear(),
current.getMonth(),
day
)
);

openModal(k);

}

lastTap=now;

});

// ========================================
// 今日の日付までスクロール
// ========================================

function scrollToday(){

const today=document.querySelector(".today");

if(today){

today.scrollIntoView({

behavior:"smooth",

block:"center"

});

}

}

setTimeout(scrollToday,300);

// ========================================
// 自動バックアップ
// ========================================

window.addEventListener("beforeunload",()=>{

const plans=loadPlans();

savePlans(plans);

});

// ========================================
// バージョン表示
// ========================================

console.log("Timelesz Schedule Ver.3 Loaded");

// ========================================
// End
// ========================================
