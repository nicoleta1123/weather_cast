import axios from "axios";
const city = process.argv[2];
console.log(process.argv);

async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=41b5f2***REMOVED***&units=metric&lang=ro";

  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    let data = response.data;
    console.log(
      `În ${data.name} se prognozează ${data.weather[0].description}.` +
        `\nTemperatura curentă este de ${data.main.temp}°C.`
    );
  } catch (error) {
    console.log(error.message);
  }
}
printCurrentWeather(city);
