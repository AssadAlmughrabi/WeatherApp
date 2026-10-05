const dateOf = (isoDateTime) => isoDateTime.slice(0, 10);

const hourOf = (isoDateTime) => Number(isoDateTime.slice(11, 13));

export const todayOf = (forecast) => dateOf(forecast.current.time);

export const hasDay = (forecast, date) => forecast.daily.some((day) => day.date === date);

export const hoursFor = (forecast, date) => {
  const hours = forecast.hourly.filter((hour) => dateOf(hour.time) === date);
  if (date !== todayOf(forecast)) return hours;

  const currentHour = hourOf(forecast.current.time);
  return hours.filter((hour) => hourOf(hour.time) >= currentHour);
};
