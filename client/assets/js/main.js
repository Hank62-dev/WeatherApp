const icon = document.getElementById("searchIcon");
const input = document.getElementById("inputSearch");

icon.addEventListener("click", () => {
  input.classList.toggle("show");
  input.focus();
});

//  update current time
function showCurrentDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("currentDateLocation").textContent =
    now.toLocaleDateString("vi-VN", options);
}
function showCurrentTime() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  document.getElementById("currentTimeLocation").textContent =
    now.toLocaleTimeString("vi-VN", options);
}

//
document.addEventListener("DOMContentLoaded", () => {
  showCurrentDate();
  showCurrentTime();
  setInterval(showCurrentTime, 1000);
});

window.addEventListener("load", () => {
  const fill = document.querySelector(".progressFill");
  const loadingScreen = document.querySelector(".loadingScreen");
  const whiteBlock = document.querySelector(".inforDetailLocation");

  let progress = 0;

  const timer = setInterval(() => {
    progress += 3;
    fill.style.width = progress + "%";

    if (progress >= 120) {
      clearInterval(timer);

      loadingScreen.style.opacity = "0";

      setTimeout(() => {
        loadingScreen.style.display = "none";

        whiteBlock.style.animation = "slideDownWhite 1.8s ease forwards";
        // toolBar
        setTimeout(() => {
          document.querySelector(".toolBar").classList.add("showToolBar");
        }, 1100);
        //
        // inforCurrentLocation
        setTimeout(() => {
          document
            .querySelector(".inforCurrentLocation")
            .classList.add("showInforLocation");
        }, 1800);

        // preForecast
        setTimeout(() => {
          document
            .querySelector(".preForecast")
            .classList.add("showNarrowForecast");
        }, 1800);
        //nextForecast
        setTimeout(() => {
          document
            .querySelector(".nextForecast")
            .classList.add("showNarrowForecast");
        }, 1800);
        //
      }, 100);
    }
  }, 60);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document
      .querySelectorAll(
        ".inforDetailLocation .temperation, .inforDetailLocation .currTime, .inforDetailLocation .extraInfor"
      )
      .forEach((el) => (el.style.opacity = "1"));
  }, 4500);
});
