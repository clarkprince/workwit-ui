const TOKEN_NAME = "auth_token";

export const setAuthCookie = (token: string) => {
  document.cookie = `${TOKEN_NAME}=${token}; path=/; max-age=864000; SameSite=Strict`;
};

export const removeAuthCookie = () => {
  document.cookie = `${TOKEN_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getAuthCookie = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${TOKEN_NAME}=`));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};
