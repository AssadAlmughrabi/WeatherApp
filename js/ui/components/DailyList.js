import { createElement, createIcon, createVisuallyHidden } from '../shared/dom.js';

const DAY_COUNT = 7;

export class DailyList {
  #root;

  constructor(root) {
    this.#root = root;
  }

  render({ isLoading, daily }) {
    this.#root.setAttribute('aria-busy', String(isLoading));
    this.#root.replaceChildren(...(isLoading ? this.#placeholders() : daily.map((day) => this.#createCard(day))));
  }

  #placeholders() {
    return Array.from({ length: DAY_COUNT }, () =>
      createElement('li', { className: 'day-card skeleton', attributes: { 'aria-hidden': 'true' } }, [
        createElement('p', { className: 'day-card-name', text: '–' }),
        createElement('span', { className: 'day-card-icon' }),
        createElement('p', { className: 'day-card-temperatures', text: '–' }),
      ]),
    );
  }

  #createCard({ name, fullName, icon, high, low }) {
    return createElement('li', { className: 'day-card' }, [
      createElement('p', { className: 'day-card-name' }, [
        createElement('abbr', { text: name, attributes: { title: fullName } }),
      ]),
      createIcon(icon, { className: 'day-card-icon', size: 60 }),
      createElement('p', { className: 'day-card-temperatures' }, [
        createElement('span', { className: 'day-card-high' }, [createVisuallyHidden('High '), high]),
        createElement('span', { className: 'day-card-low' }, [createVisuallyHidden('Low '), low]),
      ]),
    ]);
  }
}
