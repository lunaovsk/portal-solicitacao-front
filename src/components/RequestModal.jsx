import '../theme/RequestModal.css';
import { useState, useEffect } from "react";
import { requestCategoryOptions, requestStatusLabels } from "../data/RequestTypes";
import { requestService } from "../service/requestService";

function RequestModal({ request, isReadOnly, onClose, onSaved }) {
    const isEdit = !!request;
    const [form, setForm] = useState({ 
        title: "", 
        description: "", 
        category: "" 
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (request) {
            setForm({
                title: request.title,
                description: request.description,
                category: request.requestCategory,
            });
        }
    }, [request]);

    function updateField(event) {
        if (isReadOnly) return;
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (isReadOnly) return;
        setError("");
        setSaving(true);
        
        try {
            if (isEdit) {
                await requestService.update(request.id, form);
            } else {
                await requestService.createRequest(form);
            }
            onSaved();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar a solicitação.");
        } finally {
            setSaving(false);
        }
    }

    if (isReadOnly) { 
        const viewFields = [
            { label: "Código", value: request?.id },
            { label: "Título", value: request?.title },
            { label: "Categoria", value: requestCategoryOptions.find(o => o.value === request?.requestCategory)?.label},
            { label: "Status", value: requestStatusLabels[request?.requestStatus]},
            { label: "Solicitante", value: request?.username },
            { label: "Data de abertura", value: request?.createdAt },
            { label: "Descrição", value: request?.description, isDesc: true }
        ];
        return (
            <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
                <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="modal-header">
                        <div>
                            <span className="section-kicker">Visualização</span>
                            <h2 id="modal-title">Detalhes da solicitação: {request?.id}</h2>
                        </div>
                        <button type="button" className="close-button" onClick={onClose} aria-label="Fechar">X</button>
                    </div>
                    
                    <div className="request-details">
                        {viewFields.map((field, index) => (
                            <div className="detail-group" key={index}>
                                <span className="detail-label">{field.label}</span>
                                <span className={`detail-value ${field.isDesc ? 'description-value' : ''}`}>
                                    {field.value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="primary-button" onClick={onClose}>Fechar</button>
                    </div>
                </section>
            </div>
        );
    }
    return (
        <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
            <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 id="modal-title">{isEdit ? "Editar solicitação" : "Nova solicitação"}</h2>
                    </div>
                    <button type="button" className="close-button" onClick={onClose} aria-label="Fechar">X</button>
                </div>
                <p>Preencha as informações para {isEdit ? "atualizar sua" : "abrir uma"} solicitação.</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>
                        Título
                        <input name="title" value={form.title} onChange={updateField} placeholder="Ex: Problema no acesso" required />
                    </label>
                    <label>
                        Categoria
                        <select name="category" value={form.category} onChange={updateField} required>
                            <option value="">Selecione a categoria</option>
                            {requestCategoryOptions.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Descrição
                        <textarea name="description" value={form.description} onChange={updateField} placeholder="Descreva sua solicitação..." rows="4" required />
                    </label>
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button type="submit" className="primary-button" disabled={saving}>
                            {saving ? "Salvando..." : (isEdit ? "Salvar alterações" : "Criar solicitação")}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default RequestModal;
