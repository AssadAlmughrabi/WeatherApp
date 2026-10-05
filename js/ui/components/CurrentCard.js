import { createElement, createIcon, createVisuallyHidden } from '../shared/dom.js';

const PLACEHOLDER = Object.freeze({ location: '–', date: '–', temperature: '–' });

export class CurrentCard {
  #root;

  constructor(root) {
    this.#root = root;
  }

  render({ isLoading, current }) {
    this.#root.classList.toggle('current-ready', !isLoading);
    this.#root.setAttribute('aria-busy', String(isLoading));
    this.#root.replaceChildren(
      this.#heading(),
      ...(isLoading ? this.#loadingContent() : this.#weatherContent(current)),
    );
  }

  #heading() {
    return createElement('h2', { className: 'visually-hidden', text: 'Current weather', attributes: { id: 'current-title' } });
  }

  #loadingContent() {
    const placeholder = this.#weatherContent(PLACEHOLDER);
    placeholder.forEach((element) => element.classList.add('placeholder'));

    return [
      ...placeholder,
      createElement('div', { className: 'current-loading' }, [
        createElement('img', {
          className: 'current-spinner',
          attributes: { src: 'assets/images/icon-loading.svg', alt: 'Loading', width: 32, height: 32 },
        }),
      ]),
    ];
  }

  #weatherContent({ location, date, isoDate, icon, temperature }) {
    return [
      createElement('div', { className: 'current-place' }, [
        createElement('h3', { className: 'current-location', text: location }),
        createElement('p', { className: 'current-date' }, [
          createElement('time', { text: date, attributes: isoDate ? { datetime: isoDate } : {} }),
        ]),
      ]),
      createElement('div', { className: 'current-reading' }, [
        icon
          ? createIcon(icon, { className: 'current-icon', size: 120, lazy: false })
          : createElement('span', { className: 'current-icon' }),
        createElement('p', { className: 'current-temperature' }, [
          createVisuallyHidden('Current temperature '),
          temperature,
        ]),
      ]),
    ];
  }
}
