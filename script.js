const calendar = document.querySelector(".calendar");
const monthTitle = document.getElementById("monthTitle");

let currentMonth = new Date().getMonth();
const today = new Date().getDate();

const members = {
  ALL: "#cbd5e1",       // パステルグレー
  SHORI: "#fda4af",     // パステル赤（ピンク寄り）
  FUMA: "#c4b5fd",      // パステル紫
  SO: "#86efac",        // パステル緑
  TAKUTO: "#93c5fd",    // パステル水色
  YOSHITAKA: "#a3e635", // パステル黄緑
  MASAKI: "#f9a8d4",    // パステルピンク
  SHUTO: "#fde047",     // パステル黄色
  TAIKI: "#e5e7eb"      // パステル白（薄いグレー寄り）
};

function renderCalendar() {
  calendar.innerHTML = "";

  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();

  monthTitle.textContent = `${currentMonth + 1}月`;

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.className = "day";

    const num = document.createElement("div");
    num.textContent = i;
    day.appendChild(num);

    const saved = localStorage.getItem(`plan-${currentMonth}-${i}`);

    if (saved) {
      const data = JSON.parse(saved);

      const dot = document.createElement("div");
      dot.className = "dot";

      dot.style.background = members[data.member] || members.ALL;

      const memo = document.createElement("div");
      memo.style.fontSize = "10px";
      memo.style.marginTop = "4px";
      memo.textContent = `${data.member}: ${data.text}`;

      day.appendChild(dot);
      day.appendChild(memo);
    }

    day.addEventListener("click", () => {
      const member = prompt("メンバー入力（ALL / SHORI / FUMA / SO / TAKUTO / YOSHITAKA / MASAKI / SHUTO / TAIKI）");
      if (!member) return;

      const text = prompt(`${i}日の予定`);
      if (!text) return;

      const data = {
        member: member,
        text: text
      };

      localStorage.setItem(`plan-${currentMonth}-${i}`, JSON.stringify(data));

      renderCalendar();
    });

    if (
      currentMonth === new Date().getMonth() &&
      i === today
    ) {
      day.style.background = "rgba(0, 255, 200, 0.3)";
      day.style.boxShadow = "0 0 12px rgba(0,255,200,0.7)";
    }

    calendar.appendChild(day);
  }
}

document.getElementById("prev").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) currentMonth = 11;
  renderCalendar();
};

document.getElementById("next").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) currentMonth = 0;
  renderCalendar();
};

renderCalendar();
