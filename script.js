const today = new Date().getDate();
const calendar = document.querySelector(".calendar");

let currentMonth = new Date().getMonth();
const monthTitle = document.getElementById("monthTitle");

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

    // ⭐予定取得
    const saved = localStorage.getItem(`plan-${currentMonth}-${i}`);

    // ⭐予定がある日だけメンカラドット表示
    if (saved) {
      const dot = document.createElement("div");
      dot.className = "dot";

      const colors = {
        1: "#ff4d6d",
        2: "#a855f7",
        3: "#22c55e",
        4: "#38bdf8",
        5: "#facc15",
      };

      const colorIndex = (i % 5) + 1;
      dot.style.background = colors[colorIndex];

      day.appendChild(dot);

      // 予定も表示
      const memo = document.createElement("div");
      memo.style.fontSize = "10px";
      memo.style.marginTop = "4px";
      memo.textContent = saved;
      day.appendChild(memo);
    }

    // ⭐クリックで予定入力
    day.addEventListener("click", () => {
      const text = prompt(`${i}日の予定を入力してね`);

      if (text) {
        localStorage.setItem(`plan-${currentMonth}-${i}`, text);
        renderCalendar();
      }
    });

    // ⭐今日ハイライト
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

// ← →
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
