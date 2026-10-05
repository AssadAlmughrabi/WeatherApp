import { isSearchable } from '../../state/actions.js';
import { formatLocationName } from '../formatters.js';
import { debounce } from '../shared/debounce.js';
import { Suggestions } from './Suggestions.js';

const SUGGESTION_DELAY = 300;

export class SearchBar {
  #input;
  #suggestions;
  #searchPlaces;
  #onSelect;
  #requestSuggestions;
  #latestRequest = 0;
  #isSearching = false;

  constructor({ form, input, list, searchPlaces, onSubmit, onSelect }) {
    this.#input = input;
    this.#searchPlaces = searchPlaces;
    this.#onSelect = onSelect;
    this.#suggestions = new Suggestions({ list, input, onPick: (location) => this.#select(location) });
    this.#requestSuggestions = debounce((query) => this.#loadSuggestions(query), SUGGESTION_DELAY);

    input.addEventListener('input', () => this.#requestSuggestions(input.value));
    input.addEventListener('keydown', (event) => this.#handleKeydown(event));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#closeSuggestions();
      onSubmit(input.value);
    });
    document.addEventListener('pointerdown', (event) => {
      if (!form.contains(event.target)) this.#closeSuggestions();
    });
  }

  render({ isSearching }) {
    if (isSearching === this.#isSearching) return;
    this.#isSearching = isSearching;
    if (isSearching) this.#suggestions.showProgress();
    else this.#suggestions.hide();
  }

  async #loadSuggestions(query) {
    const request = ++this.#latestRequest;

    if (!isSearchable(query)) {
      this.#suggestions.hide();
      return;
    }

    this.#suggestions.showProgress();
    try {
      const locations = await this.#searchPlaces(query);
      if (request === this.#latestRequest) this.#suggestions.showResults(locations);
    } catch {
      if (request === this.#latestRequest) this.#suggestions.showError();
    }
  }

  #handleKeydown(event) {
    if (!this.#suggestions.isOpen) return;

    const actions = {
      ArrowDown: () => this.#suggestions.move(1),
      ArrowUp: () => this.#suggestions.move(-1),
      Escape: () => this.#closeSuggestions(),
      Enter: () => this.#select(this.#suggestions.activeLocation),
    };

    if (event.key === 'Enter' && !this.#suggestions.activeLocation) return;

    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  #select(location) {
    this.#input.value = formatLocationName(location);
    this.#closeSuggestions();
    this.#onSelect(location);
  }

  #closeSuggestions() {
    this.#latestRequest++;
    this.#requestSuggestions.cancel();
    this.#suggestions.hide();
  }
}
