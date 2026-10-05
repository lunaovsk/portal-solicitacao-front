import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../service/authService";

export function ProtectedRoute() {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export function RoleRoute({ role }) {
    const userRole = authService.getRole();
    if (userRole !== role) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}
