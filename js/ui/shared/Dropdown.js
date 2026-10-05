const ITEM_SELECTOR = '[role^="menuitem"]';

export class Dropdown {
  #trigger;
  #menu;
  #isMenu;

  constructor({ trigger, menu }) {
    this.#trigger = trigger;
    this.#menu = menu;
    this.#isMenu = menu.getAttribute('role') === 'menu';

    trigger.addEventListener('click', () => this.toggle());
    trigger.addEventListener('keydown', (event) => this.#handleTriggerKeydown(event));
    menu.addEventListener('keydown', (event) => this.#handleMenuKeydown(event));
    menu.addEventListener('focusout', (event) => this.#handleFocusOut(event));
    document.addEventListener('pointerdown', (event) => this.#handleOutsidePointer(event));
  }

  get isOpen() {
    return !this.#menu.hidden;
  }

  open() {
    this.#menu.hidden = false;
    this.#trigger.setAttribute('aria-expanded', 'true');
  }

  close({ restoreFocus = false } = {}) {
    if (!this.isOpen) return;
    this.#menu.hidden = true;
    this.#trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) this.#trigger.focus();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  #items() {
    return [...this.#menu.querySelectorAll(ITEM_SELECTOR)];
  }

  #focusItem(index) {
    const items = this.#items();
    if (!items.length) return;
    items.at(index % items.length).focus();
  }

  #checkedIndex() {
    return Math.max(
      this.#items().findIndex((item) => item.getAttribute('aria-checked') === 'true'),
      0,
    );
  }

  #handleTriggerKeydown(event) {
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (!this.#isMenu) return;

    const actions = {
      ArrowDown: () => this.#focusItem(this.#checkedIndex()),
      ArrowUp: () => this.#focusItem(-1),
    };

    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    this.open();
    action();
  }

  #handleMenuKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close({ restoreFocus: true });
      return;
    }

    if (!this.#isMenu) return;

    if (event.key === 'Tab') {
      this.close();
      return;
    }

    const index = this.#items().indexOf(document.activeElement);
    const actions = {
      ArrowDown: () => this.#focusItem(index + 1),
      ArrowUp: () => this.#focusItem(index - 1),
      Home: () => this.#focusItem(0),
      End: () => this.#focusItem(-1),
    };

    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  #handleFocusOut(event) {
    const target = event.relatedTarget;
    if (!target || this.#trigger.contains(target) || this.#menu.contains(target)) return;
    this.close();
  }

  #handleOutsidePointer(event) {
    if (this.#trigger.contains(event.target) || this.#menu.contains(event.target)) return;
    this.close();
  }
}
