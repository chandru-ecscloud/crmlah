import axios from "axios";
import { loadConfig } from "./configLoader";

let API_URL = "";

loadConfig().then((config) => {
  API_URL = config;
});

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export { API_URL };
