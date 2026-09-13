const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status >= 400 && response.status < 500) {
      throw new Error(`API returned a client error: ${response.status}`);
    }

    if (response.status >= 500) {
      throw new Error(`API returned a server error: ${response.status}`);
    }

    throw new Error(`API returned an unexpected status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("API returned invalid JSON");
  }
}

export async function getCityCoordinates(city) {
  const url = new URL(GEOCODING_URL);
  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "ru",
    format: "json",
  }).toString();

  const data = await fetchJson(url);
  const cityData = data.results?.[0];

  if (!cityData) {
    throw new Error(`City not found: ${city}`);
  }

  return {
    name: cityData.name,
    country: cityData.country,
    latitude: cityData.latitude,
    longitude: cityData.longitude,
  };
}

export async function getWeatherForecast(latitude, longitude, days) {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    forecast_days: String(days),
    timezone: "auto",
  }).toString();

  const data = await fetchJson(url);
  const daily = data.daily;

  return {
    timezone: data.timezone,
    daily: {
      time: daily.time,
      temperatureMax: daily.temperature_2m_max,
      temperatureMin: daily.temperature_2m_min,
      precipitationSum: daily.precipitation_sum,
    },
  };
}
