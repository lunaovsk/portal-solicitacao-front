import requesterService from "./requesterService";
import attendantService from "./attendantService";
import { authService } from "./authService";
import { apiRequest } from "./apiClient";

export const requestService = {
    createRequest: requesterService.createRequest,
    listMine: requesterService.listMyRequests,
    update: requesterService.updateMyRequest,
    remove: requesterService.deleteMyRequest,
    updateStatus: attendantService.updateRequestStatus,
    listByRole(filters = {}) {
        return authService.getRole() === "ATTENDANT"
            ? attendantService.listAllRequests(filters)
            : requesterService.listMyRequests(filters);
    },
    getById(id) {
        return apiRequest(`/request/${id}`);
    },
};

export default requestService;
