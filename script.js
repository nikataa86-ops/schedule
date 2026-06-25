const today = new Date().getDate();

document.querySelectorAll(".day").forEach(day => {
  if (Number(day.textContent) === today) {
    day.style.background = "rgba(0, 255, 200, 0.25)";
    day.style.boxShadow = "0 0 10px rgba(0,255,200,0.6)";
  }
});
