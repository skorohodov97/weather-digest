import {
  getCityCoordinates,
  getWeatherForecast,
} from "../api/openMeteo.js";

export async function getWeatherForCity(city, days) {
  const cityData = await getCityCoordinates(city);
  const forecast = await getWeatherForecast(
    cityData.latitude,
    cityData.longitude,
    days,
  );

  return {
    city: cityData,
    forecast,
  };
}

export async function getWeatherForCities(cities, days) {
  const weatherPromises = cities.map((city) => getWeatherForCity(city, days));

  return Promise.allSettled(weatherPromises);
}
