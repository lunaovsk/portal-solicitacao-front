import { apiRequest, API_URL } from "./apiClient";

const decodeBase64Url = (value) => {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = window.atob(paddedBase64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
};

const decodeJwtPayload = (token) => {
    try {
        const [, encodedPayload] = token.split(".");
        return encodedPayload ? JSON.parse(decodeBase64Url(encodedPayload)) : null;
    } catch {
        return null;
    }
};

export const authService = {
    async login(credentials) {
        this.clearSession();
        const data = await apiRequest("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        
        localStorage.setItem("portal_jwt", data.tokenJwt);
        const payload = decodeJwtPayload(data.tokenJwt) || {};
        const rawRole = payload.scope || "";
        const role = rawRole
            .split(" ")
            .find(part => part.startsWith("ROLE_"))
            ?.replace("ROLE_", "");
        const username = payload.username;
        const userInfo = {
            ...payload,
            role,
            username
        };
        localStorage.setItem("portal_user", JSON.stringify(userInfo));
        return data;
    },

    async logout() {
        const token = this.getToken();

        try {
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: { Authorization: "Bearer " + token },
                });
            }
        } finally {
            this.clearSession();
        }
    },

    getToken() {
        return localStorage.getItem("portal_jwt");
    },

    getPayload() {
        const userStr = localStorage.getItem("portal_user");
        return userStr ? JSON.parse(userStr) : null;
    },

    getRole() {
        return this.getPayload()?.role || null;
    },

    getHomePath() {
        return "/";
    },

    isAuthenticated() {
        return Boolean(this.getToken() && this.getPayload());
    },

    clearSession() {
        localStorage.removeItem("portal_jwt");
        localStorage.removeItem("portal_user"); 
    },
};

export default authService;
