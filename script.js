let currentMonth = new Date().getMonth();
const monthTitle = document.getElementById("monthTitle");

function renderCalendar() {
  const calendar = document.querySelector(".calendar");
  calendar.innerHTML = "";

  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();

  monthTitle.textContent = `${currentMonth + 1}月`;

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.className = "day";

    const num = document.createElement("div");
    num.textContent = i;

    const dot = document.createElement("div");
    dot.className = "dot";

    day.appendChild(num);
    day.appendChild(dot);

    const saved = localStorage.getItem(`plan-${currentMonth}-${i}`);
    if (saved) {
      const memo = document.createElement("div");
      memo.style.fontSize = "10px";
      memo.textContent = saved;
      day.appendChild(memo);
    }

    day.addEventListener("click", () => {
      const text = prompt(`${i}日の予定`);
      if (text) {
        localStorage.setItem(`plan-${currentMonth}-${i}`, text);
        renderCalendar();
      }
    });

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
