// avatarService.js

export const setAvatar = (avatarUrl) => {
  localStorage.setItem('avatar', avatarUrl);  // Spara avataren i localStorage
};

export const getAvatar = () => {
  return localStorage.getItem('avatar');  // Hämta avataren från localStorage
};

export const removeAvatar = () => {
  localStorage.removeItem('avatar');  // Ta bort avataren från localStorage
};
