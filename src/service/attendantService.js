import { apiRequest, buildQueryString } from "./apiClient";

export const attendantService = {
    listAllRequests(filters = {}) {
        const queryString = buildQueryString(filters);
        return apiRequest(`/request/all${queryString}`);
    },


    updateRequestStatus(requestId, status) {
        return apiRequest(`/request/${requestId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
    },
};

export default attendantService;
