import * as weatherApi from './api/weatherApi.js';
import { createActions } from './state/actions.js';
import * as preferences from './state/preferences.js';
import { createStore, initialState } from './state/store.js';
import { App } from './ui/App.js';
import { CurrentCard } from './ui/components/CurrentCard.js';
import { DailyList } from './ui/components/DailyList.js';
import { DaySelector } from './ui/components/DaySelector.js';
import { HourlyPanel } from './ui/components/HourlyPanel.js';
import { MetricsGrid } from './ui/components/MetricsGrid.js';
import { SearchBar } from './ui/components/SearchBar.js';
import { StatusMessage } from './ui/components/StatusMessage.js';
import { UnitsMenu } from './ui/components/UnitsMenu.js';

const DEFAULT_LOCATION = Object.freeze({
  id: 2950159,
  name: 'Berlin',
  region: 'State of Berlin',
  country: 'Germany',
  latitude: 52.52437,
  longitude: 13.41053,
});

const select = (selector) => document.querySelector(selector);

const store = createStore(initialState);
const actions = createActions({ store, api: weatherApi, preferences });

const app = new App({
  store,
  layout: {
    hero: select('[data-hero]'),
    dashboard: select('[data-dashboard]'),
  },
  views: {
    searchBar: new SearchBar({
      form: select('[data-search]'),
      input: select('[data-search-input]'),
      list: select('[data-search-suggestions]'),
      searchPlaces: actions.searchPlaces,
      onSubmit: actions.search,
      onSelect: actions.loadForecast,
    }),
    unitsMenu: new UnitsMenu({
      trigger: select('[data-units-trigger]'),
      menu: select('[data-units-menu]'),
      onToggleSystem: actions.toggleUnits,
      onSelectUnit: actions.changeUnit,
    }),
    emptyMessage: new StatusMessage({ root: select('[data-empty]') }),
    errorMessage: new StatusMessage({
      root: select('[data-error]'),
      action: select('[data-retry]'),
      onAction: actions.retry,
    }),
    currentCard: new CurrentCard(select('[data-current]')),
    metricsGrid: new MetricsGrid(select('[data-metrics]')),
    dailyList: new DailyList(select('[data-daily]')),
    hourlyPanel: new HourlyPanel({
      list: select('[data-hourly-list]'),
      daySelector: new DaySelector({
        trigger: select('[data-day-trigger]'),
        label: select('[data-day-label]'),
        menu: select('[data-day-menu]'),
        onSelect: actions.selectDay,
      }),
    }),
  },
});

app.start();
actions.start(DEFAULT_LOCATION);
