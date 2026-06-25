const today = new Date().getDate();

const calendar = document.querySelector(".calendar");

for (let i = 1; i <= 31; i++) {
  const day = document.createElement("div");
  day.className = "day";
  day.textContent = i;

  if (i === today) {
    day.style.background = "rgba(0, 255, 200, 0.3)";
    day.style.boxShadow = "0 0 12px rgba(0,255,200,0.7)";
    day.style.border = "1px solid rgba(0,255,200,0.8)";
  }

  calendar.appendChild(day);
}
