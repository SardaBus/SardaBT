import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct the import

const API_URL = 'http://localhost:3000'; // Ensure the API URL is correct
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function createAuth() {
    const { subscribe, set, update } = writable({
        token: browser && localStorage.getItem(TOKEN_KEY),
        user: null,
        usertype: null
    });

    async function refreshAuthToken() {
        const refreshToken = browser && localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
            try {
                const res = await axios.post(`${API_URL}/api/refresh-token`, { refreshToken });
                const { token, newRefreshToken } = res.data;
                if (browser) {
                    localStorage.setItem(TOKEN_KEY, token);
                    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }
                const decoded = jwtDecode(token);
                set({ token, user: decoded.username, usertype: decoded.usertype });
            } catch (err) {
                console.error('Token refresh error', err);
                set({ token: null, user: null, usertype: null });
                if (browser) {
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(REFRESH_TOKEN_KEY);
                }
            }
        } else {
            set({ token: null, user: null, usertype: null });
        }
    }

    return {
        subscribe,
        login: async (username, password) => {
            try {
                const res = await axios.post(`${API_URL}/api/login`, { username, password });
                const { token, refreshToken } = res.data;
                if (browser) {
                    localStorage.setItem(TOKEN_KEY, token);
                    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
                }
                const decoded = jwtDecode(token);
                set({ token, user: decoded.username, usertype: decoded.usertype });
            } catch (err) {
                console.error('Login error', err);
                set({ token: null, user: null, usertype: null });
            }
        },
        logout: () => {
            if (browser) {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
            }
            set({ token: null, user: null, usertype: null });
        },
        checkAuth: () => {
            const token = browser && localStorage.getItem(TOKEN_KEY);
            if (token) {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;
                if (decoded.exp < now) {
                    refreshAuthToken();
                } else {
                    set({ token, user: decoded.username, usertype: decoded.usertype });
                }
            } else {
                refreshAuthToken();
            }
        }
    };
}

export const auth = createAuth();
