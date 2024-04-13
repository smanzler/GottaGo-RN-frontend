import ApiManager from "./ApiManager";
import axios, { AxiosResponse } from "axios";

type Login = {
    email: string;
    password: string;
    twoFactorCode: string;
    twoFactorRecoveryCode: string;
}

export const userLogin = async (data: Login): Promise<AxiosResponse<any, any>> => {
    try {
        const result: AxiosResponse = await ApiManager.post("/user/login", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("Login successful:", result.status, result.data);
        return result;
    } catch (error: any) { 
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.status, error.response?.data);
            throw error; 
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error('An unexpected error occurred during login');
        }
    }
}