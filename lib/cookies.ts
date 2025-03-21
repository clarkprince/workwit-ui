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

export const setUserCookie = (name: string, email: string, role: string, tenant: string) => {
  document.cookie = `user_name=${encodeURIComponent(name)};path=/`;
  document.cookie = `user_email=${encodeURIComponent(email)};path=/`;
  document.cookie = `user_role=${encodeURIComponent(role)};path=/`;
  document.cookie = `user_tenant=${encodeURIComponent(tenant)};path=/`;
};

export const getUserCookies = () => {
  const name = document.cookie.match("(^|;)\\s*user_name\\s*=\\s*([^;]+)")?.pop() || "";
  const email = document.cookie.match("(^|;)\\s*user_email\\s*=\\s*([^;]+)")?.pop() || "";
  const role = document.cookie.match("(^|;)\\s*user_role\\s*=\\s*([^;]+)")?.pop() || "";
  const tenant = document.cookie.match("(^|;)\\s*user_tenant\\s*=\\s*([^;]+)")?.pop() || "";
  return {
    name: decodeURIComponent(name),
    email: decodeURIComponent(email),
    role: decodeURIComponent(role),
    tenant: decodeURIComponent(tenant),
  };
};

export const clearUserCookies = () => {
  document.cookie = "user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  document.cookie = "user_tenant=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
};
