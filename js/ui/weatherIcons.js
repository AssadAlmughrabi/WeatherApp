import { WeatherCondition } from '../domain/weatherCodes.js';

const ICON_DIRECTORY = 'assets/images';

const ICONS = Object.freeze({
  [WeatherCondition.SUNNY]: { file: 'icon-sunny.webp', alt: 'Sunny' },
  [WeatherCondition.PARTLY_CLOUDY]: { file: 'icon-partly-cloudy.webp', alt: 'Partly cloudy' },
  [WeatherCondition.OVERCAST]: { file: 'icon-overcast.webp', alt: 'Overcast' },
  [WeatherCondition.FOG]: { file: 'icon-fog.webp', alt: 'Fog' },
  [WeatherCondition.DRIZZLE]: { file: 'icon-drizzle.webp', alt: 'Drizzle' },
  [WeatherCondition.RAIN]: { file: 'icon-rain.webp', alt: 'Rain' },
  [WeatherCondition.SNOW]: { file: 'icon-snow.webp', alt: 'Snow' },
  [WeatherCondition.STORM]: { file: 'icon-storm.webp', alt: 'Thunderstorm' },
});

export const weatherIcon = (condition) => {
  const { file, alt } = ICONS[condition] ?? ICONS[WeatherCondition.OVERCAST];
  return { src: `${ICON_DIRECTORY}/${file}`, alt };
};
console.log(weatherIcon(WeatherCondition)); // { src: 'assets/images/icon-sunny.webp', alt: 'Sunny' }
