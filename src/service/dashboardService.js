import { apiRequest } from "./apiClient";

export const dashboardService = {
    getRequesterDashboard() {
        return apiRequest("/dashboard");
    },

    getAttendantDashboard() {
        return apiRequest("/dashboard/all");
    },
};

export default dashboardService;
