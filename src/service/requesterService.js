import { apiRequest, buildQueryString } from "./apiClient";

export const requesterService = {
    createRequest(requestData) {
        return apiRequest("/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });
    },

    listMyRequests(filters = {}) {
        const queryString = buildQueryString(filters);
        return apiRequest(`/request/filter${queryString}`);
    },


    updateMyRequest(requestId, requestData) {
        return apiRequest(`/request/${requestId}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });
    },

    deleteMyRequest(requestId) {
        return apiRequest(`/request/${requestId}/delete`, {
            method: "DELETE",
        });
    },
};

export default requesterService;
