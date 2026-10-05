import { formatLocationFullName } from '../formatters.js';
import { createElement } from '../shared/dom.js';

const OPTION_ID_PREFIX = 'search-suggestion';

export class Suggestions {
  #list;
  #input;
  #onPick;
  #locations = [];
  #activeIndex = -1;

  constructor({ list, input, onPick }) {
    this.#list = list;
    this.#input = input;
    this.#onPick = onPick;
    list.addEventListener('mousedown', (event) => event.preventDefault());
  }

  get isOpen() {
    return !this.#list.hidden;
  }

  get activeLocation() {
    return this.#locations[this.#activeIndex] ?? null;
  }

  showProgress() {
    this.#showStatus({ icon: 'icon-loading.svg', iconClass: 'suggestions-spinner', text: 'Search in progress' });
  }

  showError() {
    this.#showStatus({ icon: 'icon-error.svg', text: 'Couldn’t load places. Check your connection and try again.' });
  }

  showResults(locations) {
    if (!locations.length) {
      this.hide();
      return;
    }
    this.#reset();
    this.#locations = locations;
    this.#list.replaceChildren(...locations.map((location, index) => this.#createOption(location, index)));
    this.#open();
  }

  move(step) {
    const count = this.#locations.length;
    if (!count) return;
    this.#activeIndex =
      this.#activeIndex === -1 && step < 0 ? count - 1 : (this.#activeIndex + step + count) % count;
    this.#highlight();
  }

  hide() {
    this.#list.hidden = true;
    this.#input.setAttribute('aria-expanded', 'false');
    this.#reset();
  }

  #reset() {
    this.#locations = [];
    this.#activeIndex = -1;
    this.#input.removeAttribute('aria-activedescendant');
  }

  #showStatus({ icon, iconClass, text }) {
    this.#reset();
    this.#list.replaceChildren(
      createElement('li', { className: 'suggestions-status', attributes: { role: 'option', 'aria-disabled': 'true' } }, [
        createElement('img', {
          className: iconClass,
          attributes: { src: `assets/images/${icon}`, alt: '', width: 16, height: 16 },
        }),
        text,
      ]),
    );
    this.#open();
  }

  #open() {
    this.#list.hidden = false;
    this.#input.setAttribute('aria-expanded', 'true');
  }

  #highlight() {
    [...this.#list.children].forEach((option, index) => {
      const isActive = index === this.#activeIndex;
      option.setAttribute('aria-selected', String(isActive));
      if (!isActive) return;
      this.#input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    });
  }

  #createOption(location, index) {
    const option = createElement('li', {
      className: 'suggestions-item',
      text: formatLocationFullName(location),
      attributes: { id: `${OPTION_ID_PREFIX}-${index}`, role: 'option', 'aria-selected': 'false' },
    });
    option.addEventListener('click', () => this.#onPick(location));
    return option;
  }
}
