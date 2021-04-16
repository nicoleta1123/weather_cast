import axios from "axios";
import chalk from "chalk";
import { OPEN_WEATHER_MAP_API_KEY } from "./credentials.js";
import Table from "cli-table3";
import { DateTime } from "luxon";

/**
 *  @typedef {object} WeatherData
 *
 *
 *  @param {string} url
 *
 * @returns {WeatherData}
 */
async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    const errorDescription = {
      404:
        "Denumirea orașului nu este validă. " +
        "Vă rugăm verificați dacă ați introdus corect numele orașului.",
      401: "API key este incorectă. Vă rugăm verificați fișierul credentials.js.",
      429: "Ați depășit limita de cererei către OpenWeatherMap API.",
      500: "Ne pare rău, a apărut o eroare internă a serverului.",
      ENOTFOUND:
        "Nu există o conexiune cu internetul." +
        "Verificați setările și aparatajul pentru interent.",
      get EAI_AGAIN() {
        return this.ENOTFOUND;
      },
    };
    if (errorDescription[error.response.data.cod])
      console.log(chalk.red.bold(errorDescription[error.response.data.cod]));
    else
      console.log(
        "Sarean bratan. Aishi ii cacaita eroare care n-am mai vazut-o."
      );
  }
  process.exit();
}

export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  let data = await getData(OPEN_WEATHER_MAP_API);
  console.log(
    `În ${data.name} se prognozează ${data.weather[0].description}.` +
      `\nTemperatura curentă este de ${Math.round(data.main.temp)}°C. ` +
      `\nLong: ${data.coord.lon} Lat: ${data.coord.lat}.`
  );

  return data.coord;
}
/**
 *
 * @param {WeatherData} data
 *
 * @return {table}
 */

export async function printWeatherFor7Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  const data = await getData(OPEN_WEATHER_MAP_API);
  console.log(genForecastTable(data).toString());
}
function genForecastTable(data) {
  const table = new Table({
    head: ["Data", "Temp max", "Temp min", "Viteza vantului"],
  });
  const dailyData = data.daily;
  //console.log(dailyData);
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale("ro")
      .toLocaleString(DateTime.DATE_MED);
    const arr = [
      date,
      dayData.dt,
      `${dayData.temp.max}°C`,
      `${dayData.temp.min}°C`,
      `${dayData.wind_speed}m/s`,
    ];
    table.push(arr);
  });
  return table;
}
