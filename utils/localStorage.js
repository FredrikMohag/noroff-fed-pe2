export const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const loadLocal = (key) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const removeLocal = (key) => localStorage.removeItem(key);

export const clearLocal = () => localStorage.clear();
