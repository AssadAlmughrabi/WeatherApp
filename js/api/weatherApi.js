import { conditionFromCode } from '../domain/weatherCodes.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT = 10000;
const RESULT_LIMIT = 5;

const FORECAST_FIELDS = Object.freeze({
  current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
  hourly: 'temperature_2m,weather_code',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  timezone: 'auto',
  forecast_days: 7,
});

const getJson = async (baseUrl, params) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));

  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT) });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

const toLocation = ({ id, name, admin1, country, latitude, longitude }) => ({
  id,
  name,
  region: admin1 ?? '',
  country: country ?? '',
  latitude,
  longitude,
});

const toForecast = (location, { current, daily, hourly }) => ({
  location,
  current: {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    condition: conditionFromCode(current.weather_code),
  },
  daily: daily.time.map((date, index) => ({
    date,
    high: daily.temperature_2m_max[index],
    low: daily.temperature_2m_min[index],
    condition: conditionFromCode(daily.weather_code[index]),
  })),
  hourly: hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    condition: conditionFromCode(hourly.weather_code[index]),
  })),
});

export const searchPlaces = async (query) => {
  const data = await getJson(GEOCODING_URL, { name: query, count: RESULT_LIMIT, language: 'en', format: 'json' });
  return (data.results ?? []).map(toLocation);
};

export const getForecast = async (location) => {
  const data = await getJson(FORECAST_URL, {
    latitude: location.latitude,
    longitude: location.longitude,
    ...FORECAST_FIELDS,
  });
  return toForecast(location, data);
};
