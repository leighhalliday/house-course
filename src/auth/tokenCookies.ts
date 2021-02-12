import cookies from "js-cookie";

export const getTokenCookie = () => cookies.get("token");

export const setTokenCookie = (token: string) => {
  cookies.set("token", token, {
    expires: 1 / 24,
  });
};

export const removeTokenCookie = () => cookies.remove("token");
