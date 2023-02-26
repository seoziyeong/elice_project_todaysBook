import axios from "axios";

const token = localStorage.getItem("JWT") || "";
const SERVER_ADDRESS = "http://localhost:3001";

export const customAxios = axios.create({
  baseURL: `${SERVER_ADDRESS}`,
  headers: {
    authorization: `Bearer ${token}`,
  },
});

customAxios.interceptors.request.use((config) => {
  /* JWT 토큰 */
  const userAccessToken = localStorage.getItem("JWT");
  if (userAccessToken) {
    config.headers["authorization"] = `Bearer ${userAccessToken}`;
  }
  return config;
});
