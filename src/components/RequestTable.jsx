import '../theme/RequestTable.css';
import {
    requestCategoryLabels,
    requestStatusLabels,
    requestStatusOptions,
} from "../data/RequestTypes";

function RequestTable({ requests = [], loading = false, error = "", onEdit, onDelete, onStatusChange, onView }) {
    const hasActions = onEdit || onDelete || onStatusChange || onView;

    return (
        <section className="request-table-card">
            <div className="request-table-header">
                <div>
                    <span className="section-kicker">Acompanhamento solicitações</span>
                </div>
                <span className="request-table-count">{requests.length} solicitação</span>
            </div>

            <div className="request-table-wrapper">
                {error && <p className="error-message">{error}</p>}
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Título</th>
                            <th>Categoria</th>
                            <th>Status</th>
                            <th>Data de abertura</th>
                            <th>Usuário</th>
                            {hasActions && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={hasActions ? 7 : 6}>Carregando...</td>
                            </tr>
                        ) : requests.length ? requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.title}</td>
                                <td>{requestCategoryLabels[request.requestCategory]}</td>
                                <td>{requestStatusLabels[request.requestStatus]}</td>
                                <td>{request.createdAt}</td>
                                <td>{request.username}</td>
                                {hasActions && (
                                    <td className="actions-cell">
                                        {onView && (
                                            <button type="button" onClick={() => onView(request)}>Visualizar</button>
                                        )}
                                        {onEdit && (
                                            <button 
                                                type="button" 
                                                onClick={() => onEdit(request)}
                                                disabled={request.requestStatus !== "OPEN"}
                                            >
                                                Editar
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button 
                                                type="button" 
                                                onClick={() => onDelete(request.id)}
                                                disabled={request.requestStatus !== "OPEN"}
                                            >
                                                Excluir
                                            </button>
                                        )}
                                        {onStatusChange && (
                                            <select 
                                                value={request.requestStatus} 
                                                onChange={(e) => onStatusChange(request.id, e.target.value)}
                                            >
                                                {requestStatusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={hasActions ? 7 : 6}>Nenhuma solicitação encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default RequestTable;
