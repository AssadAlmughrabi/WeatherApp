export const createElement = (tag, { className, text, attributes = {} } = {}, children = []) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  element.append(...children);
  return element;
};

export const createIcon = ({ src, alt }, { className, size, lazy = true }) =>
  createElement('img', {
    className,
    attributes: { src, alt, width: size, height: size, loading: lazy ? 'lazy' : 'eager', decoding: 'async' },
  });

export const createVisuallyHidden = (text) => createElement('span', { className: 'visually-hidden', text });
