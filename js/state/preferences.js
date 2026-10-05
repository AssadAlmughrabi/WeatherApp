import { METRIC, normalizeUnits } from '../domain/units.js';

const STORAGE_KEY = 'weather-now:units';

export const loadUnits = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeUnits(JSON.parse(saved)) : METRIC;
  } catch {
    return METRIC;
  }
};

export const saveUnits = (units) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
    return true;
  } catch {
    return false;
  }
};
