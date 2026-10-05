import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cards from "../components/Cards";
import RequestFilters from "../components/RequestFilters";
import RequestTable from "../components/RequestTable";
import Header from "../components/Header";
import RequestModal from "../components/RequestModal";
import { authService } from "../service/authService";
import { dashboardService } from "../service/dashboardService";
import { requestService } from "../service/requestService";
import { requestStatusLabels } from "../data/RequestTypes";


const initialFilters = {
    title: "",
    category: "",
    status: "",
    startDate: "",
    endDate: "",
};

function Home() {
    const navigate = useNavigate();
    const user = authService.getPayload();
    const role = authService.getRole();
    
    const [filters, setFilters] = useState(initialFilters);
    const [dashboard, setDashboard] = useState(null);
    const [dashboardError, setDashboardError] = useState("");
    
    const [requests, setRequests] = useState([]);
    const [requestsError, setRequestsError] = useState("");
    const [loadingRequests, setLoadingRequests] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    const [isReadOnly, setIsReadOnly] = useState(false);

    const loadDashboard = useCallback(() => {
        const fetchDashboard = role === "ATTENDANT"
            ? dashboardService.getAttendantDashboard
            : dashboardService.getRequesterDashboard;

        fetchDashboard()
            .then(setDashboard)
            .catch((error) => {
                setDashboardError(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar o resumo.",
                );
            });
    }, [role]);

    const loadRequests = useCallback(() => {
        setLoadingRequests(true);
        requestService.listByRole(filters)
            .then(setRequests)
            .catch((error) => {
                setRequestsError(error instanceof Error ? error.message : "Erro ao carregar solicitações");
            })
            .finally(() => setLoadingRequests(false));
    }, [filters, role]);

    useEffect(() => {
        loadDashboard();
        loadRequests();
    }, [loadDashboard, loadRequests]);

    const handleCreateRequest = () => {
        setEditingRequest(null);
        setIsReadOnly(false);
        setIsModalOpen(true);
    };

    const handleEditRequest = async (request) => {
        if (request.requestStatus === "OPEN") {
            try {
                const detailedRequest = await requestService.getById(request.id);
                setEditingRequest(detailedRequest);
                setIsReadOnly(false);
                setIsModalOpen(true);
            } catch (error) {
                alert(error instanceof Error ? error.message : "Erro ao buscar detalhes da solicitação");
            }
        } else {
            alert("Apenas solicitações com status OPEN podem ser editadas.");
        }
    };

    const handleViewRequest = async (request) => {
        try {
            const detailedRequest = await requestService.getById(request.id);
            setEditingRequest(detailedRequest);
            setIsReadOnly(true);
            setIsModalOpen(true);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao buscar detalhes da solicitação");
        }
    };

    const handleDeleteRequest = async (requestId) => {
        const req = requests.find(r => r.id === requestId);
        if (req && req.requestStatus === "OPEN") {
            if (window.confirm("Deseja realmente excluir esta solicitação?")) {
                try {
                    await requestService.remove(requestId);
                    loadRequests();
                    loadDashboard();
                } catch (error) {
                    alert(error instanceof Error ? error.message : "Erro ao excluir.");
                }
            }
        } else {
            alert("Apenas solicitações com status OPEN podem ser excluídas.");
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        const req = requests.find(r => r.id === requestId);
        if (!window.confirm(`Deseja realmente alterar o status da solicitação #${requestId} para "${requestStatusLabels[newStatus] || newStatus}"?`)) {
            // Se o usuário cancelar, recarregamos a lista para voltar o select pro valor anterior
            loadRequests();
            return;
        }
        
        try {
            await requestService.updateStatus(requestId, newStatus);
            loadRequests();
            loadDashboard();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erro ao alterar status.");
        }
    };

    const handleModalClose = (refresh = false) => {
        setIsModalOpen(false);
        setEditingRequest(null);
        setIsReadOnly(false);
        if (refresh) {
            loadRequests();
            loadDashboard();
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Deseja realmente sair do sistema?")) {
            await authService.logout();
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="app-shell">
            <Header 
                user={user} 
                onCreateRequest={role === "REQUESTER" ? handleCreateRequest : undefined} 
                onLogout={handleLogout} 
            />
            <main className="home-page">
                <header className="home-heading">
                    <div>
                        <span className="section-kicker">VISÃO GERAL</span>
                        <h1>Dashboard {role === "ATTENDANT" ? "Global" : "Pessoal"}</h1>
                        <p>Acompanhe os chamados e encontre rapidamente o que precisa.</p>
                    </div>
                    {dashboardError && (
                        <p className="home-error" role="alert">{dashboardError}</p>
                    )}
                </header>

                <Cards dashboard={dashboard} />
                <RequestFilters filters={filters} onChange={setFilters} />
                <RequestTable 
                    requests={requests} 
                    loading={loadingRequests}
                    error={requestsError}
                    onEdit={role === "REQUESTER" ? handleEditRequest : null}
                    onDelete={role === "REQUESTER" ? handleDeleteRequest : null}
                    onStatusChange={role === "ATTENDANT" ? handleStatusChange : null}
                    onView={handleViewRequest}
                />

                {isModalOpen && (
                    <RequestModal 
                        request={editingRequest}
                        isReadOnly={isReadOnly}
                        onClose={() => handleModalClose(false)}
                        onSaved={() => handleModalClose(true)}
                    />
                )}
            </main>
        </div>
    );
}

export default Home;
