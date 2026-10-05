export const debounce = (callback, delay) => {
  let timer;

  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
};
