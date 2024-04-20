import axios, { AxiosResponse } from "axios";
import ApiManager from "./ApiManager";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

interface LoginResponse {
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string,
}

interface ErrorResponse {
    type: string,
    title: string,
    status: number,
    detail: string,
}

type Login = {
    email: string;
    password: string;
    twoFactorCode?: string; 
    twoFactorRecoveryCode?: string;
}

export const userLogin = async (data: Login, login: () => void): Promise<AxiosResponse<LoginResponse, any>> => {
    try {
        const result: AxiosResponse<LoginResponse> = await ApiManager.post("/login", data);
        login();
        return result;
    } catch (error) {
        if (axios.isAxiosError<ErrorResponse>(error)) {
            console.error("Error: ", error); 
            throw error;
        } else {
            console.error("An unexpected non-Axios error occurred:", error);
            throw new Error('An unexpected error occurred during login');
        }
    }
}

export const userSignOut = async () => {
    try {
        await SecureStore.deleteItemAsync('AccessToken');
        await SecureStore.deleteItemAsync('RefreshToken');
    } catch (error) {
        console.error('Error: ' + error);
    }
}

export const checkToken = async () => {
    try {
        const accessToken = await SecureStore.getItemAsync('AccessToken');
        return accessToken !== null; 
    } catch (error) {
        console.error('Error checking login status:', error);
        return false; 
    }
}