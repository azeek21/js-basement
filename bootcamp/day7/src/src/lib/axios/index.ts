import axios from "axios";
import { GET_SERVER_BASE_URL } from "../configs";

export const axiosInstance = axios.create({
  baseURL: GET_SERVER_BASE_URL(),
  timeout: 5000,
})
