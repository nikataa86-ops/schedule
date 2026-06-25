const today = new Date().getDate();
const calendar = document.querySelector(".calendar");

calendar.innerHTML = "";

// ここがメンカラ設定（あとで好きに変えられる）
const colors = {
  1: "#ff4d6d",
  2: "#a855f7",
  3: "#22c55e",
  4: "#38bdf8",
  5: "#facc15",
};

for (let i = 1; i <= 31; i++) {
  const day = document.createElement("div");
  day.className = "day";

  const num = document.createElement("div");
  num.textContent = i;

  const dot = document.createElement("div");
  dot.className = "dot";

  // 日付ごとに色変える
  const colorIndex = (i % 5) + 1;
  dot.style.background = colors[colorIndex];

  day.appendChild(num);
  day.appendChild(dot);

  // 今日ハイライト
  if (i === today) {
    day.style.background = "rgba(0, 255, 200, 0.3)";
    day.style.boxShadow = "0 0 12px rgba(0,255,200,0.7)";
  }

  calendar.appendChild(day);
}
