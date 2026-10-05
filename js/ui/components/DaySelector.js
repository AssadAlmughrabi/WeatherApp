import { createElement } from '../shared/dom.js';
import { Dropdown } from '../shared/Dropdown.js';

export class DaySelector {
  #trigger;
  #label;
  #menu;
  #dropdown;
  #onSelect;
  #renderedDays = '';

  constructor({ trigger, label, menu, onSelect }) {
    this.#trigger = trigger;
    this.#label = label;
    this.#menu = menu;
    this.#onSelect = onSelect;
    this.#dropdown = new Dropdown({ trigger, menu });
  }

  render({ days, selectedLabel, disabled }) {
    this.#label.textContent = selectedLabel;
    this.#trigger.disabled = disabled;
    if (disabled) this.#dropdown.close();

    const dayKey = days.map(({ value }) => value).join();
    if (dayKey !== this.#renderedDays) {
      this.#renderedDays = dayKey;
      this.#menu.replaceChildren(...days.map((day) => this.#createItem(day)));
    }

    const selected = days.find((day) => day.selected)?.value;
    this.#menu.querySelectorAll('[role="menuitemradio"]').forEach((item) => {
      item.setAttribute('aria-checked', String(item.dataset.value === selected));
    });
  }

  #createItem({ value, label }) {
    const item = createElement('button', {
      className: 'menu-item',
      text: label,
      attributes: { type: 'button', role: 'menuitemradio', 'aria-checked': 'false', 'data-value': value },
    });
    item.addEventListener('click', () => {
      this.#dropdown.close({ restoreFocus: true });
      this.#onSelect(value);
    });
    return item;
  }
}
