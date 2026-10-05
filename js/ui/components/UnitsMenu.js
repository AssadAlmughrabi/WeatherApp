import { isImperial, PrecipitationUnit, TemperatureUnit, WindSpeedUnit } from '../../domain/units.js';
import { createElement } from '../shared/dom.js';
import { Dropdown } from '../shared/Dropdown.js';

const UNIT_GROUPS = Object.freeze([
  {
    key: 'temperature',
    label: 'Temperature',
    options: [
      { value: TemperatureUnit.CELSIUS, label: 'Celsius (°C)' },
      { value: TemperatureUnit.FAHRENHEIT, label: 'Fahrenheit (°F)' },
    ],
  },
  {
    key: 'windSpeed',
    label: 'Wind Speed',
    options: [
      { value: WindSpeedUnit.KMH, label: 'km/h' },
      { value: WindSpeedUnit.MPH, label: 'mph' },
    ],
  },
  {
    key: 'precipitation',
    label: 'Precipitation',
    options: [
      { value: PrecipitationUnit.MILLIMETER, label: 'Millimeters (mm)' },
      { value: PrecipitationUnit.INCH, label: 'Inches (in)' },
    ],
  },
]);

export class UnitsMenu {
  #dropdown;
  #switchButton;
  #options = [];

  constructor({ trigger, menu, onToggleSystem, onSelectUnit }) {
    this.#dropdown = new Dropdown({ trigger, menu });

    this.#switchButton = createElement('button', {
      className: 'menu-item',
      attributes: { type: 'button' },
    });
    this.#switchButton.addEventListener('click', onToggleSystem);

    menu.append(this.#switchButton, ...UNIT_GROUPS.map((group) => this.#createGroup(group, onSelectUnit)));
  }

  render(units) {
    this.#switchButton.textContent = isImperial(units) ? 'Switch to Metric' : 'Switch to Imperial';
    this.#options.forEach(({ key, value, input }) => {
      input.checked = units[key] === value;
    });
  }

  #createGroup({ key, label, options }, onSelectUnit) {
    return createElement('fieldset', { className: 'menu-group' }, [
      createElement('legend', { className: 'menu-group-label', text: label }),
      ...options.map((option) => this.#createOption(key, option, onSelectUnit)),
    ]);
  }

  #createOption(key, { value, label }, onSelectUnit) {
    const input = createElement('input', {
      className: 'visually-hidden',
      attributes: { type: 'radio', name: `units-${key}`, value },
    });
    input.addEventListener('change', () => onSelectUnit({ [key]: value }));
    this.#options.push({ key, value, input });
    return createElement('label', { className: 'menu-item' }, [input, label]);
  }
}
