import { hasDay, todayOf } from '../domain/forecast.js';
import { normalizeUnits, toggleUnitSystem } from '../domain/units.js';
import { Status } from './store.js';

const MIN_QUERY_LENGTH = 2;

export const isSearchable = (query) => query.trim().length >= MIN_QUERY_LENGTH;

export const createActions = ({ store, api, preferences }) => {
  let latestForecastRequest = 0;

  const searchPlaces = async (query) => (isSearchable(query) ? api.searchPlaces(query.trim()) : []);

  const loadForecast = async (location) => {
    const request = ++latestForecastRequest;
    store.update({ status: Status.LOADING, isSearching: false, lastRequest: { location } });

    try {
      const forecast = await api.getForecast(location);
      if (request !== latestForecastRequest) return;
      store.update({ status: Status.SUCCESS, forecast, selectedDate: todayOf(forecast) });
    } catch {
      if (request !== latestForecastRequest) return;
      store.update({ status: Status.ERROR });
    }
  };

  const search = async (query) => {
    const term = query.trim();
    if (!term) return;

    store.update({ isSearching: true, lastRequest: { query: term } });

    try {
      const [location] = await searchPlaces(term);
      if (!location) {
        store.update({ status: Status.EMPTY, isSearching: false });
        return;
      }
      await loadForecast(location);
    } catch {
      store.update({ status: Status.ERROR, isSearching: false });
    }
  };

  const retry = async () => {
    const { lastRequest } = store.state;
    if (lastRequest?.location) return loadForecast(lastRequest.location);
    if (lastRequest?.query) return search(lastRequest.query);
  };

  const setUnits = (units) => {
    preferences.saveUnits(units);
    store.update({ units });
  };

  const changeUnit = (changes) => setUnits(normalizeUnits({ ...store.state.units, ...changes }));

  const toggleUnits = () => setUnits(toggleUnitSystem(store.state.units));

  const selectDay = (date) => {
    const { forecast } = store.state;
    if (forecast && hasDay(forecast, date)) store.update({ selectedDate: date });
  };

  const start = (defaultLocation) => {
    store.update({ units: preferences.loadUnits() });
    return loadForecast(defaultLocation);
  };

  return { searchPlaces, search, loadForecast, retry, changeUnit, toggleUnits, selectDay, start };
};
