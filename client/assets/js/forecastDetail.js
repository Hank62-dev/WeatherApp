document.addEventListener("DOMContentLoaded", function () {
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
});
