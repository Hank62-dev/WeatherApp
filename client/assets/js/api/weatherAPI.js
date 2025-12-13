const KEY_API = "a34c75fec0fa436ead5105247251112";
const BASE_URL = "https://api.weatherapi.com/v1";

//
const tempEl = document.getElementById("temperation");
const nameLocationCurrent = document.getElementById("nameLocationCurrent");
const iconForecastEl = document.querySelector(".iconForecast");

const humidityEl = document.querySelector(".droplet .temperation");
const windEl = document.querySelector(".wind .temperation");
const rainEl = document.querySelector(".cloudyHeavy .temperation");
const pressureEl = document.querySelector(".gauge .temperation");
const tempHighEl = document.querySelector(".tempHigh .temperation");
const tempLowEl = document.querySelector(".tempLow .temperation");

const preBtn = document.querySelector(".preForecast .narrowPre");
const nextBtn = document.querySelector(".nextForecast .narrowNext");

const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("inputSearch");

const convertBtn = document.getElementById("convertMode");

let isCelsius = true;
let currentWeather = null;
let currentIndex = 3; //

//
function convertWeatherIcon(condition) {
  const text = condition.toLowerCase();
  //
  if (text.includes("sun") || text.includes("clear")) return "☀️";
  if (text.includes("partly") || text.includes("cloud")) return "⛅";
  if (text.includes("cloudy") && !text.includes("partly")) return "☁️";

  if (text.includes("light rain")) return "🌦️";
  if (text.includes("rain")) return "🌧️";

  if (text.includes("thunder") || text.includes("storm")) return "⛈️";
  if (text.includes("lightning")) return "🌩️";

  if (text.includes("snow")) return "🌨️";
  return "☀️";
}
//
async function getWeatherHistory(city, date) {
  const url = `${BASE_URL}/history.json?key=${KEY_API}&q=${city}&dt=${date}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.forecast.forecastday[0];
}

async function getWeather(city) {
  const today = new Date();
  const forecastPromises = [];

  for (let i = 3; i > 0; i--) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const dateStr = pastDate.toISOString().split("T")[0];
    forecastPromises.push(getWeatherHistory(city, dateStr));
  }

  const url = `${BASE_URL}/forecast.json?key=${KEY_API}&q=${city}&days=4&aqi=no&alerts=no`;
  const res = await fetch(url);
  const data = await res.json();
  forecastPromises.push(...data.forecast.forecastday);

  currentWeather = {
    name: data.location.name,
    region: data.location.region,
    forecast: await Promise.all(forecastPromises),
  };

  currentIndex = 3;
  updateUI();
}
// locations
document.querySelectorAll(".location").forEach((loc) => {
  loc.addEventListener("click", () => {
    const city = loc.dataset.city; // tên chuẩn cho API
    const displayName = loc.dataset.name; // tên hiển thị trên UI

    nameLocationCurrent.textContent = displayName;

    getWeather(city);
  });
});

//
function updateUI() {
  if (!currentWeather || !currentWeather.forecast) return;

  const dayData = currentWeather.forecast[currentIndex];

  nameLocationCurrent.textContent = currentWeather.name;

  //
  const dateObj = new Date(dayData.date);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  document.getElementById("currentDateLocation").textContent =
    dateObj.toLocaleDateString("vi-VN", options);

  tempEl.textContent = isCelsius
    ? dayData.day.avgtemp_c + "°C"
    : dayData.day.avgtemp_f + "°F";

  //
  const newIcon = convertWeatherIcon(dayData.day.condition.text);
  if (iconForecastEl.textContent !== newIcon) {
    iconForecastEl.classList.remove("icon-slide-in", "icon-slide-out");
    iconForecastEl.classList.add("icon-slide-out");

    setTimeout(() => {
      iconForecastEl.textContent = newIcon;
      iconForecastEl.classList.remove("icon-slide-out");
      iconForecastEl.classList.add("icon-slide-in");
    }, 500);
  }

  // extra infor
  humidityEl.textContent = dayData.day.avghumidity + "%";
  windEl.textContent = dayData.day.maxwind_kph + " km/h";
  rainEl.textContent = dayData.day.totalprecip_mm + " mm";
  pressureEl.textContent = dayData.day.avgvis_km + " hPa";

  tempHighEl.textContent = isCelsius
    ? dayData.day.maxtemp_c + "°C"
    : dayData.day.maxtemp_f + "°F";

  tempLowEl.textContent = isCelsius
    ? dayData.day.mintemp_c + "°C"
    : dayData.day.mintemp_f + "°F";
}

//
preBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateUI();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < currentWeather.forecast.length - 1) {
    currentIndex++;
    updateUI();
  }
});

// --- Search
searchIcon.addEventListener("click", () => {
  searchInput.classList.toggle("show");
  searchInput.focus();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(searchInput.value.trim());
    searchInput.value = "";
  }
});

//
convertBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  updateUI();
});

const convertBtun = document.getElementById("convertToggle");
const body = document.querySelector("body");
let isLight = true;

convertBtun.addEventListener("click", () => {
  isLight = !isLight;
  convertBtun.classList.toggle("active");
  if (isLight) {
    body.style.background =
      " radial-gradient(circle,rgba(255, 255, 255, 1) 0%,rgba(112, 171, 248, 1) 52%)";
  } else {
    // nền tối
    body.style.background =
      "radial-gradient(circle, rgba(255,255,255,0) 0%, rgb(26,34,44) 102%)";
  }

  //
  const emojiSpan = convertBtun.querySelector(".emojiToggle");
  emojiSpan.textContent = isLight ? "⚫" : "⚪";
});

// default weather
getWeather("Ho Chi Minh");
