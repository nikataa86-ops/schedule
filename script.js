const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const planList = document.getElementById("planList");

const members = {
  ALL: { color:"#cbd5e1" },
  SHORI: { color:"#fda4af" },
  FUMA: { color:"#c4b5fd" },
  SO: { color:"#86efac" },
  TAKUTO: { color:"#93c5fd" },
  YOSHITAKA: { color:"#bef264" },
  MASAKI: { color:"#f9a8d4" },
  SHUTO: { color:"#fde68a" },
  TAIKI: { color:"#f3f4f6" }
};

let current = new Date();
let filter = "ALL";

function key(date){
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

function loadPlans(){
  return JSON.parse(localStorage.getItem("plans") || "{}");
}

function savePlans(data){
  localStorage.setItem("plans", JSON.stringify(data));
}

function renderCalendar(){

  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  monthTitle.textContent = `${year}年 ${month+1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const plans = loadPlans();

  for(let i=0;i<firstDay;i++){
    const blank=document.createElement("div");
    calendar.appendChild(blank);
  }

  for(let day=1; day<=lastDate; day++){

    const cell=document.createElement("div");
    cell.className="day";

    const number=document.createElement("div");
    number.className="day-number";
    number.textContent=day;
    cell.appendChild(number);

    if(
      today.getFullYear()===year &&
      today.getMonth()===month &&
      today.getDate()===day
    ){
      cell.classList.add("today");
    }

    const k = key(new Date(year,month,day));

    if(plans[k] && (filter==="ALL" || plans[k].member===filter)){

      const dot=document.createElement("div");
      dot.className="dot";
      dot.style.background=members[plans[k].member].color;
      cell.appendChild(dot);
    }
        cell.addEventListener("click",()=>{

      const plans = loadPlans();
      const k = key(new Date(year,month,day));
      const old = plans[k];

      const member = prompt(
`メンバーを入力

ALL
SHORI
FUMA
SO
TAKUTO
YOSHITAKA
MASAKI
SHUTO
TAIKI`,
old ? old.member : "ALL"
      );

      if(member===null) return;

      if(!members[member]){
        alert("メンバー名が違います");
        return;
      }

      const text = prompt(
        "予定を入力",
        old ? old.text : ""
      );

      if(text===null) return;

      if(text.trim()===""){
        delete plans[k];
      }else{
        plans[k]={
          member:member,
          text:text
        };
      }

      savePlans(plans);

      renderCalendar();

      showPlan(day);

    });

    calendar.appendChild(cell);

  }

}
function showPlan(day){

  const plans = loadPlans();

  const k = key(
    new Date(
      current.getFullYear(),
      current.getMonth(),
      day
    )
  );

  if(!plans[k]){
    planList.innerHTML = `
      <div class="plan-card">
        <h3>${day}日</h3>
        <p>予定はありません</p>
      </div>
    `;
    return;
  }

  const color = members[plans[k].member].color;

  planList.innerHTML = `
    <div class="plan-card">
      <h3>${day}日</h3>

      <div class="member-row">
        <span class="member-dot"
              style="background:${color}">
        </span>

        ${plans[k].member}

      </div>

      <div class="plan-text">
        ${plans[k].text}
      </div>

    </div>
  `;
}

document.getElementById("prevMonth").addEventListener("click", () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
  planList.innerHTML = "日付をタップすると予定が表示されます";
});

document.getElementById("nextMonth").addEventListener("click", () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
  planList.innerHTML = "日付をタップすると予定が表示されます";
});

document.querySelectorAll(".member-filter button").forEach(button=>{

  button.addEventListener("click",()=>{

    document
      .querySelectorAll(".member-filter button")
      .forEach(btn=>btn.classList.remove("active"));

    button.classList.add("active");

    filter = button.dataset.member;

    renderCalendar();

  });

});

renderCalendar();

document
  .querySelector('[data-member="ALL"]')
  .classList.add("active");
// ---------- 保存 ----------

saveBtn.addEventListener("click",()=>{

const plans=loadPlans();

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

deleteBtn.addEventListener("click",()=>{

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
