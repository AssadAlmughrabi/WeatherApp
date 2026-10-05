export const WeatherCondition = Object.freeze({
  SUNNY: 'sunny',
  PARTLY_CLOUDY: 'partly-cloudy',
  OVERCAST: 'overcast',
  FOG: 'fog',
  DRIZZLE: 'drizzle',
  RAIN: 'rain',
  SNOW: 'snow',
  STORM: 'storm',
});

const WMO_CODE_CONDITIONS = [
  { codes: [0], condition: WeatherCondition.SUNNY },
  { codes: [1, 2], condition: WeatherCondition.PARTLY_CLOUDY },
  { codes: [3], condition: WeatherCondition.OVERCAST },
  { codes: [45, 48], condition: WeatherCondition.FOG },
  { codes: [51, 53, 55, 56, 57], condition: WeatherCondition.DRIZZLE },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], condition: WeatherCondition.RAIN },
  { codes: [71, 73, 75, 77, 85, 86], condition: WeatherCondition.SNOW },
  { codes: [95, 96, 99], condition: WeatherCondition.STORM },
];

export const conditionFromCode = (code) =>
  WMO_CODE_CONDITIONS.find(({ codes }) => codes.includes(code))?.condition ?? WeatherCondition.OVERCAST;
