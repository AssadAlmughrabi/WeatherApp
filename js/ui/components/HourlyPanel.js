import { createElement, createIcon } from '../shared/dom.js';

const PLACEHOLDER_COUNT = 8;

export class HourlyPanel {
  #list;
  #daySelector;
  #renderedDay = null;

  constructor({ list, daySelector }) {
    this.#list = list;
    this.#daySelector = daySelector;
  }

  render({ isLoading, days, selectedDay, selectedDayLabel, hourly }) {
    this.#daySelector.render({ days, selectedLabel: selectedDayLabel, disabled: isLoading });
    this.#list.setAttribute('aria-busy', String(isLoading));
    this.#list.replaceChildren(...(isLoading ? this.#placeholders() : hourly.map((hour) => this.#createRow(hour))));

    if (selectedDay !== this.#renderedDay) {
      this.#renderedDay = selectedDay;
      this.#list.scrollTop = 0;
    }
  }

  #placeholders() {
    return Array.from({ length: PLACEHOLDER_COUNT }, () =>
      createElement('li', { className: 'hour skeleton', attributes: { 'aria-hidden': 'true' } }, [
        createElement('span', { className: 'hour-icon' }),
        createElement('span', { className: 'hour-time', text: '–' }),
        createElement('span', { className: 'hour-temperature', text: '–' }),
      ]),
    );
  }

  #createRow({ time, isoTime, icon, temperature }) {
    return createElement('li', { className: 'hour' }, [
      createIcon(icon, { className: 'hour-icon', size: 40 }),
      createElement('time', { className: 'hour-time', text: time, attributes: { datetime: isoTime } }),
      createElement('span', { className: 'hour-temperature', text: temperature }),
    ]);
  }
}
