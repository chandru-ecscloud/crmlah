import { loadConfig } from "./configLoader";

let API_URL = "";

loadConfig().then((config) => {
  API_URL = config;
});

export { API_URL };
