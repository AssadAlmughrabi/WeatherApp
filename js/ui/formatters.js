import {
  convertPrecipitation,
  convertTemperature,
  convertWindSpeed,
  PrecipitationUnit,
  WindSpeedUnit,
} from '../domain/units.js';

const LOCALE = 'en-US';

const longDateFormat = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const weekdayFormat = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const shortWeekdayFormat = new Intl.DateTimeFormat(LOCALE, { weekday: 'short' });
const hourFormat = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric' });
const decimalFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

const WIND_SPEED_LABELS = Object.freeze({
  [WindSpeedUnit.KMH]: 'km/h',
  [WindSpeedUnit.MPH]: 'mph',
});

const PRECIPITATION_LABELS = Object.freeze({
  [PrecipitationUnit.MILLIMETER]: 'mm',
  [PrecipitationUnit.INCH]: 'in',
});

const toLocalDate = (isoDateTime) => {
  const [year, month, day] = isoDateTime.slice(0, 10).split('-').map(Number);
  const hour = Number(isoDateTime.slice(11, 13)) || 0;
  return new Date(year, month - 1, day, hour);
};

const round = (value) => Math.round(value) || 0;

const joinUnique = (parts) => [...new Set(parts.filter(Boolean))].join(', ');

export const formatLocationName = ({ name, country }) => joinUnique([name, country]);

export const formatLocationFullName = ({ name, region, country }) => joinUnique([name, region, country]);

export const formatLongDate = (isoDate) => longDateFormat.format(toLocalDate(isoDate));

export const formatWeekday = (isoDate) => weekdayFormat.format(toLocalDate(isoDate));

export const formatShortWeekday = (isoDate) => shortWeekdayFormat.format(toLocalDate(isoDate));

export const formatHour = (isoDateTime) => hourFormat.format(toLocalDate(isoDateTime));

export const formatTemperature = (celsius, unit) => `${round(convertTemperature(celsius, unit))}°`;

export const formatWindSpeed = (kilometersPerHour, unit) =>
  `${round(convertWindSpeed(kilometersPerHour, unit))} ${WIND_SPEED_LABELS[unit]}`;

export const formatPrecipitation = (millimeters, unit) =>
  `${decimalFormat.format(convertPrecipitation(millimeters, unit))} ${PRECIPITATION_LABELS[unit]}`;

export const formatPercentage = (value) => `${round(value)}%`;
