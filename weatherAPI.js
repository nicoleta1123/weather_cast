import axios from "axios";
import { OPEN_WEATHER_MAP_API_KEY } from "./credentials.js";
import Table from "cli-table3";
import { DateTime } from "luxon";
async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
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

export async function printWeatherFor7Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;

  let data = await getData(OPEN_WEATHER_MAP_API);
  let table = new Table({
    head: ["Data", "Temp max", "Temp min", "Viteza vantului"],
  });
  const dailyData = data.daily;
  console.log(dailyData);
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

  console.log(table.toString());
}
