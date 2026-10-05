export class StatusMessage {
  #root;

  constructor({ root, action, onAction }) {
    this.#root = root;
    action?.addEventListener('click', onAction);
  }

  render(isVisible) {
    this.#root.hidden = !isVisible;
  }
}
