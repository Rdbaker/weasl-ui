const COOKIE_NAME = 'WEASL_AUTH';


export const getToken = () => {
  const startIndex = document.cookie.indexOf(`${COOKIE_NAME}=`);
  if (startIndex === -1) {
    return null;
  }
  const startSlice = startIndex + COOKIE_NAME.length + 1;
  const endIndex = document.cookie.slice(startIndex).indexOf(';');
  if (endIndex === -1) {
    return document.cookie.slice(startSlice);
  } else {
    return document.cookie.slice(startSlice, startIndex + endIndex);
  }
};

export const setToken = (token) => {
  // TODO: this should be configurable via settings
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7);

  document.cookie = `${COOKIE_NAME}=${token};expires=${expireDate.toUTCString()};path=/`;
};
