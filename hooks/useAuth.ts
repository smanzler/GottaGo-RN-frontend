import * as SecureStore from 'expo-secure-store';

export const isSignedIn = async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync("AccessToken");
    return token !== null;
};

export const signOut = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync("AccessToken");
        await SecureStore.deleteItemAsync("RefreshToken");
        console.log("Successfully signed out.");
    } catch (error) {
        console.error("Error during sign out:", error);
    }
};