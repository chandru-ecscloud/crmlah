
import axios from "axios";

export async function loadConfig() {
  try {
    const response = await axios.get("/config.json");
    const config = response.data.backend_url;
    return config;
  } catch (error) {
    console.error("Error loading configuration:", error);
    throw error;
  }
}
