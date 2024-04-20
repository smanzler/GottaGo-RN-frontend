import axios from "axios";

const ApiManager = axios.create({
    baseURL: "https://tfinderapi.azurewebsites.net/",
    responseType: 'json',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default ApiManager;