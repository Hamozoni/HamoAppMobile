
import * as SecureStore from 'expo-secure-store';

class TokenService {

    // Access token (memory only)
    getAccessToken = async () => {
        return await SecureStore.getItemAsync("accessToken")
    }

    setAccessToken = async (token: string) => {
        await SecureStore.setItemAsync("accessToken", token);
    }
    clearAccessToken = async () => {
        return await SecureStore.deleteItemAsync("accessToken");
    }

    // Refresh token (secure storage)
    getRefreshToken = async () => {
        return await SecureStore.getItemAsync("refreshToken")
    }
    setRefreshToken = async (token: string) => {
        await SecureStore.setItemAsync("refreshToken", token);
    }
    clearRefreshToken = async () => {
        await SecureStore.deleteItemAsync("refreshToken");
    }
}

export default new TokenService();
