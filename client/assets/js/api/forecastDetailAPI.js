const KEY_API = "a34c75fec0fa436ead5105247251112";
const BASE_URL = "https://api.weatherapi.com/v1";

//
const inputSearch = document.querySelector("#inputSearch");
const searchIcon = document.querySelector("#searchIcon");

const nameLocationCurrent = document.querySelector("#nameLocationCurrent");
const temperation = document.querySelector("#temperation");
const iconForecastEl = document.querySelector(".iconForecast");
const description = document.querySelector(".description");
const currentDateLocation = document.querySelector("#currentDateLocation");
const currentTimeLocation = document.querySelector("#currentTimeLocation");
const tempHigh = document.querySelector(".tempHigh .temperation");
const tempLow = document.querySelector(".tempLow .temperation");

const cloudyHeavy = document.querySelector(".cloudyHeavy .temperation");
const wind = document.querySelector(".wind .temperation");
const uv = document.querySelector(".uv .temperation");
const gauge = document.querySelector(".gauge .temperation");
const droplet = document.querySelector(".droplet .temperation");
const vision = document.querySelector(".vision .temperation");

//

async function fetchWeather(city = "Ho Chi Minh") {
  try {
    const url = `${BASE_URL}/forecast.json?key=${KEY_API}&q=${city}&days=5&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();

    renderCurrentWeather(data);
    renderHighlights(data);
    renderHourlyForecast(data);
    renderDayForecast(data);
  } catch (err) {
    console.log("Fetch weather error: ", err);
  }
}

//
function convertIconWeather(condition) {
  const text = condition.toLowerCase();
  //
  if (text.includes("sun") || text.includes("clear")) return "☀️";
  if (text.includes("partly") || text.includes("cloudy")) return "⛅";
  if (text.includes("cloudy") && !text.includes("partly")) return "☁️";

  if (text.includes("light rain")) return "🌦️";
  if (text.includes("rain")) return "🌧️";

  if (text.includes("thunder") || text.includes("storm")) return "⛈️";
  if (text.includes("lightning")) return "🌩️";

  if (text.includes("snow")) return "🌨️";
  return "☀️";
}

//
function renderCurrentWeather(data) {
  nameLocationCurrent.textContent = data.location.name;

  temperation.textContent = `${Math.round(data.current.temp_c)}°C`;
  iconForecastEl.textContent = convertIconWeather(data.current.condition.text);

  description.textContent = data.current.condition.text;

  const date = new Date(data.location.localtime);

  currentDateLocation.textContent = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  currentTimeLocation.textContent = date.toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = data.forecast.forecastday[0];
  tempHigh.textContent = `${Math.round(today.day.maxtemp_c)}°C`;
  tempLow.textContent = `${Math.round(today.day.mintemp_c)}°C`;
}

//
function renderHighlights(data) {
  cloudyHeavy.innerHTML = `${data.current.precip_mm} <span>mm</span>`;
  wind.innerHTML = `${data.current.wind_kph} <span>km/h</span>`;
  uv.textContent = data.current.uv;
  gauge.innerHTML = `${data.current.pressure_mb} <span>mb</span>`;
  droplet.innerHTML = `${data.current.humidity} <span>%</span>`;
  vision.innerHTML = `${data.current.vis_km} <span>km</span>`;
}

//
function renderHourlyForecast(data) {
  const list = document.querySelector("#splideHourForecast .splide__list");
  list.innerHTML = "";

  const hours = data.forecast.forecastday[0].hour;

  hours.forEach((hour) => {
    const time = hour.time.split(" ")[1];
    const icon = convertIconWeather(hour.condition.text);

    const li = document.createElement("li");
    li.className = "splide__slide oneHour";

    li.innerHTML = `
      <div class="contentFCast">
        <div class="timeAt">${time}</div>
        <div class="iFCast">${icon}</div>
        <div class="tempTime">${Math.round(hour.temp_c)}°C</div>
      </div>
    `;

    list.appendChild(li);
  });

  //
  new Splide("#splideHourForecast", {
    type: "loop",
    perPage: 7,
    perMove: 1,
    pagination: false,
    arrows: false,
    drag: "free",
    gap: "1rem",
    wheel: true,
  }).mount();
}

//
function renderDayForecast(data) {
  const container = document.querySelector(".extraInforDayforecast");
  container.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    const date = new Date(day.date);
    const dayName = date.toDateString("en-US", {
      weekday: "long",
    });

    const icon = convertIconWeather(day.day.condition.text);

    const div = document.createElement("div");
    div.innerHTML = `<div class="dayItem">
        <div class="title">${dayName}</div>
        <div class="iconFcast">${icon}</div>
        <div class="descript">${day.day.condition.text}</div>
        <div class="tempa">${Math.round(day.day.avgtemp_c)}°C</div>
      </div>
      <hr class="lineBottom" />`;

    container.appendChild(div);
  });
}

//
searchIcon.addEventListener("click", () => {
  const city = inputSearch.value.trim();
  if (city) fetchWeather(city);
});

inputSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = inputSearch.value.trim();
    if (city) fetchWeather(city);
  }
});

//
fetchWeather();
