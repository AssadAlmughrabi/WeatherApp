import { hoursFor, todayOf } from '../domain/forecast.js';
import { Status } from '../state/store.js';
import {
  formatHour,
  formatLocationName,
  formatLongDate,
  formatPercentage,
  formatPrecipitation,
  formatShortWeekday,
  formatTemperature,
  formatWeekday,
  formatWindSpeed,
} from './formatters.js';
import { weatherIcon } from './weatherIcons.js';

const METRIC_PLACEHOLDER = '—';
const DAY_PLACEHOLDER = '–';
const DASHBOARD_STATUSES = [Status.IDLE, Status.LOADING, Status.SUCCESS];

const presentCurrent = (forecast, units) => ({
  location: formatLocationName(forecast.location),
  date: formatLongDate(todayOf(forecast)),
  isoDate: todayOf(forecast),
  icon: weatherIcon(forecast.current.condition),
  temperature: formatTemperature(forecast.current.temperature, units.temperature),
});

const presentMetrics = (current, units) => [
  { label: 'Feels Like', value: current ? formatTemperature(current.feelsLike, units.temperature) : METRIC_PLACEHOLDER },
  { label: 'Humidity', value: current ? formatPercentage(current.humidity) : METRIC_PLACEHOLDER },
  { label: 'Wind', value: current ? formatWindSpeed(current.windSpeed, units.windSpeed) : METRIC_PLACEHOLDER },
  {
    label: 'Precipitation',
    value: current ? formatPrecipitation(current.precipitation, units.precipitation) : METRIC_PLACEHOLDER,
  },
];

const presentDaily = (daily, units) =>
  daily.map((day) => ({
    name: formatShortWeekday(day.date),
    fullName: formatWeekday(day.date),
    icon: weatherIcon(day.condition),
    high: formatTemperature(day.high, units.temperature),
    low: formatTemperature(day.low, units.temperature),
  }));

const presentDays = (daily, selectedDate) =>
  daily.map((day) => ({
    value: day.date,
    label: formatWeekday(day.date),
    selected: day.date === selectedDate,
  }));

const presentHourly = (hours, units) =>
  hours.map((hour) => ({
    time: formatHour(hour.time),
    isoTime: hour.time,
    icon: weatherIcon(hour.condition),
    temperature: formatTemperature(hour.temperature, units.temperature),
  }));

export const presentState = ({ status, isSearching, forecast, units, selectedDate }) => {
  const isReady = status === Status.SUCCESS && Boolean(forecast);

  return {
    units,
    isSearching,
    isLoading: !isReady,
    visibility: {
      hero: status !== Status.ERROR,
      dashboard: DASHBOARD_STATUSES.includes(status),
      empty: status === Status.EMPTY,
      error: status === Status.ERROR,
    },
    current: isReady ? presentCurrent(forecast, units) : null,
    metrics: presentMetrics(isReady ? forecast.current : null, units),
    daily: isReady ? presentDaily(forecast.daily, units) : [],
    days: isReady ? presentDays(forecast.daily, selectedDate) : [],
    selectedDay: isReady ? selectedDate : null,
    selectedDayLabel: isReady ? formatWeekday(selectedDate) : DAY_PLACEHOLDER,
    hourly: isReady ? presentHourly(hoursFor(forecast, selectedDate), units) : [],
  };
};
