import { createElement } from '../shared/dom.js';

export class MetricsGrid {
  #root;

  constructor(root) {
    this.#root = root;
  }

  render({ metrics }) {
    this.#root.replaceChildren(
      ...metrics.map(({ label, value }) =>
        createElement('div', { className: 'metric' }, [
          createElement('dt', { className: 'metric-label', text: label }),
          createElement('dd', { className: 'metric-value', text: value }),
        ]),
      ),
    );
  }
}
