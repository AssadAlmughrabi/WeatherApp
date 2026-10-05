export const TemperatureUnit = Object.freeze({
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
});

export const WindSpeedUnit = Object.freeze({
  KMH: 'kmh',
  MPH: 'mph',
});

export const PrecipitationUnit = Object.freeze({
  MILLIMETER: 'mm',
  INCH: 'inch',
});

export const METRIC = Object.freeze({
  temperature: TemperatureUnit.CELSIUS,
  windSpeed: WindSpeedUnit.KMH,
  precipitation: PrecipitationUnit.MILLIMETER,
});

export const IMPERIAL = Object.freeze({
  temperature: TemperatureUnit.FAHRENHEIT,
  windSpeed: WindSpeedUnit.MPH,
  precipitation: PrecipitationUnit.INCH,
});

const KILOMETERS_PER_MILE = 1.609344;
const MILLIMETERS_PER_INCH = 25.4;

const pickAllowed = (allowedUnits, value, fallback) =>
  Object.values(allowedUnits).includes(value) ? value : fallback;

export const normalizeUnits = ({ temperature, windSpeed, precipitation } = {}) =>
  Object.freeze({
    temperature: pickAllowed(TemperatureUnit, temperature, METRIC.temperature),
    windSpeed: pickAllowed(WindSpeedUnit, windSpeed, METRIC.windSpeed),
    precipitation: pickAllowed(PrecipitationUnit, precipitation, METRIC.precipitation),
  });

export const isImperial = (units) => Object.keys(IMPERIAL).every((key) => units[key] === IMPERIAL[key]);

export const toggleUnitSystem = (units) => (isImperial(units) ? METRIC : IMPERIAL);

export const convertTemperature = (celsius, unit) =>
  unit === TemperatureUnit.FAHRENHEIT ? (celsius * 9) / 5 + 32 : celsius;

export const convertWindSpeed = (kilometersPerHour, unit) =>
  unit === WindSpeedUnit.MPH ? kilometersPerHour / KILOMETERS_PER_MILE : kilometersPerHour;

export const convertPrecipitation = (millimeters, unit) =>
  unit === PrecipitationUnit.INCH ? millimeters / MILLIMETERS_PER_INCH : millimeters;
