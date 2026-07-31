import "./style.css";

const apiKey = "N9V4X43D7UNXS2SYDUUHFC6VW";
let cMode = false;

async function getData(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`,
    );
    const data = await response.json();
    return processData(data);
  } catch (error) {
    console.error(error);
  }
}

function processData(data) {
  return {
    location: data.resolvedAddress,
    temp: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity,
    windSpeed: data.currentConditions.windspeed,
    description: data.description,
  };
}

function toggleTemp() {
  cMode = !cMode;
  const tempElement = document.querySelector(".temperature");
  const toggleElement = document.querySelector(".toggle-btn");
  if (!tempElement || !toggleElement) return;

  const rawTemp = Number(tempElement.dataset.temp);
  if (cMode) {
    const celsius = Math.round(((rawTemp - 32) * 5) / 9);
    tempElement.textContent = `Temperature: ${celsius}°C`;
    toggleElement.textContent = "Toggle to Farenheit";
  } else {
    tempElement.textContent = `Temperature: ${rawTemp}°F`;
    toggleElement.textContent = "Toggle to Celcius";
  }
}

function updateBackground(tempF) {
  const main = document.querySelector("main");

  main.classList.remove("freezing", "burning");

  if (tempF < 0) {
    main.style.backgroundColor = "";
    main.classList.add("freezing");
  } else if (tempF > 100) {
    main.style.backgroundColor = "";
    main.classList.add("burning");
  } else {
    const clampedTemp = Math.max(0, Math.min(100, tempF));

    const hue = 200 - (clampedTemp / 100) * 200;

    main.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
  }
}

async function renderData(location) {
  const data = await getData(location);
  const weatherContainer = document.querySelector(".weather-container");
  weatherContainer.style.backgroundColor = "white";
  weatherContainer.innerHTML = "";

  const locationElement = document.createElement("h3");
  locationElement.textContent = `Location is: ${data.location}`;

  const tempElement = document.createElement("h2");
  tempElement.dataset.temp = data.temp;
  tempElement.classList.add("temperature");
  updateBackground(data.temp);

  const conditionsElement = document.createElement("p");
  conditionsElement.classList.add("conditions");
  conditionsElement.textContent = `Conditions: ${data.conditions}`;

  const statsDiv = document.createElement("div");
  statsDiv.classList.add("additional-stats");

  const humidityElement = document.createElement("p");
  humidityElement.textContent = `Humidity: ${data.humidity}%`;

  const windspeedElement = document.createElement("p");
  windspeedElement.textContent = `Wind Speed: ${data.windSpeed}mph`;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = `${data.description}`;

  const toggleElement = document.createElement("button");
  toggleElement.classList.add("toggle-btn");
  toggleElement.textContent = "Toggle to Celcius";
  toggleElement.addEventListener("click", toggleTemp);

  const rawTemp = Number(tempElement.dataset.temp);
  if (cMode) {
    const celsius = Math.round(((rawTemp - 32) * 5) / 9);
    tempElement.textContent = `Temperature: ${celsius}°C`;
    toggleElement.textContent = "Toggle to Farenheit";
  } else {
    tempElement.textContent = `Temperature: ${rawTemp}°F`;
    toggleElement.textContent = "Toggle to Celcius";
  }

  statsDiv.append(humidityElement);
  statsDiv.append(windspeedElement);

  weatherContainer.append(locationElement);
  weatherContainer.append(tempElement);
  weatherContainer.append(conditionsElement);
  weatherContainer.append(statsDiv);
  weatherContainer.append(descriptionElement);
  weatherContainer.append(toggleElement);
}

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = searchInput.value;

  searchForm.reset();
  if (!location) return;
  renderData(location);
});
