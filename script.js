const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const planList = document.getElementById("planList");

const members = {
  ALL: { color: "#cbd5e1" },
  SHORI: { color: "#fda4af" },
  FUMA: { color: "#c4b5fd" },
  SO: { color: "#86efac" },
  TAKUTO: { color: "#93c5fd" },
  YOSHITAKA: { color: "#bef264" },
  MASAKI: { color: "#f9a8d4" },
  SHUTO: { color: "#fde68a" },
  TAIKI: { color: "#f3f4f6" }
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

  calendar.innerHTML="";

  const year=current.getFullYear();
  const month=current.getMonth();

  monthTitle.textContent=
    `${year}年 ${month+1}月`;

  const firstDay=
    new Date(year,month,1).getDay();

  const lastDate=
    new Date(year,month+1,0).getDate();

  const today=new Date();

  for(let i=0;i<firstDay;i++){
    const blank=document.createElement("div");
    calendar.appendChild(blank);
  }

  const plans=loadPlans();

  for(let day=1;day<=lastDate;day++){

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

    const k=key(new Date(year,month,day));

    if(plans[k]){

      if(filter==="ALL" || plans[k].member===filter){

        const dot=document.createElement("div");
        dot.className="dot";
        dot.style.background=
          members[plans[k].member].color;

        cell.appendChild(dot);

        const preview=document.createElement("div");
        preview.className="plan-preview";
        preview.textContent=plans[k].text;

        cell.appendChild(preview);
      }

    }
        cell.addEventListener("click",()=>{

      const plans=loadPlans();

      const k=key(new Date(year,month,day));

      const old=plans[k];

      const member=prompt(
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

      const text=prompt(
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

  // 中身
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

// メンバーフィルター
document.querySelectorAll(".member-filter button").forEach(button => {

  button.addEventListener("click", () => {

    // ボタンの選択状態
    document
      .querySelectorAll(".member-filter button")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    filter = button.dataset.member;

    renderCalendar();

    planList.innerHTML = `
      <p>${filter} の予定を表示中</p>
    `;
  });

});

// 初期表示
renderCalendar();

// ALLを最初に選択状態にする
document
  .querySelector('[data-member="ALL"]')
  .classList.add("active");
