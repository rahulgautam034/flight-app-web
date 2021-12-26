export const url = "http://localhost:8081/";

export const setToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("isUserAuthenticated", true);
};

export const getToken = () => {
  return localStorage.getItem("token");
};



export const createHttpHeader = () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
  };
  return config;
};
