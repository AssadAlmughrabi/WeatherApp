import { presentState } from './presenter.js';

export class App {
  #store;
  #layout;
  #views;

  constructor({ store, layout, views }) {
    this.#store = store;
    this.#layout = layout;
    this.#views = views;
  }

  start() {
    this.#store.subscribe((state) => this.#render(state));
    this.#render(this.#store.state);
  }

  #render(state) {
    const viewModel = presentState(state);
    const { visibility } = viewModel;
    const { searchBar, unitsMenu, emptyMessage, errorMessage, currentCard, metricsGrid, dailyList, hourlyPanel } =
      this.#views;

    searchBar.render(viewModel);
    unitsMenu.render(viewModel.units);
    this.#layout.hero.hidden = !visibility.hero;
    this.#layout.dashboard.hidden = !visibility.dashboard;
    emptyMessage.render(visibility.empty);
    errorMessage.render(visibility.error);

    if (!visibility.dashboard) return;

    currentCard.render(viewModel);
    metricsGrid.render(viewModel);
    dailyList.render(viewModel);
    hourlyPanel.render(viewModel);
  }
}
