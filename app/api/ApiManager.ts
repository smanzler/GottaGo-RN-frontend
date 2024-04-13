import axios from "axios";

const ApiManager = axios.create({
    baseURL: "https://localhost:7066/",
    responseType: 'json',
    withCredentials: true,
});

export default ApiManager;