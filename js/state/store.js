import { METRIC } from '../domain/units.js';

export const Status = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  EMPTY: 'empty',
  ERROR: 'error',
});

export const initialState = Object.freeze({
  status: Status.IDLE,
  isSearching: false,
  units: METRIC,
  forecast: null,
  selectedDate: null,
  lastRequest: null,
});

export const createStore = (state) => {
  let current = Object.freeze({ ...state });
  const listeners = new Set();

  return {
    get state() {
      return current;
    },
    update(changes) {
      current = Object.freeze({ ...current, ...changes });
      listeners.forEach((listener) => listener(current));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
