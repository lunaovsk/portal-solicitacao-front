const API_URL = import.meta.env.VITE_API_URL;

const getAuthorizationHeaders = () => {
    const token = localStorage.getItem("portal_jwt");
    return token ? { Authorization: "Bearer " + token } : {};
};

const buildQueryString = (filters = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, value);
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : "";
};

const apiRequest = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...getAuthorizationHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        let errorMsg = "Não foi possível concluir a operação.";
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMsg = errorData.message;
            }
        } catch (e) {
        }
        throw new Error(errorMsg);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text; // Retorna como string se não for um JSON válido
    }
};

export { apiRequest, buildQueryString, getAuthorizationHeaders, API_URL };
