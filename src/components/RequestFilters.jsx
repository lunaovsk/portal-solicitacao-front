import '../theme/RequestFilters.css';
import { requestCategoryOptions, requestStatusOptions } from "../data/RequestTypes";

function RequestFilters({filters, onChange}) {
  const currentFilters = {
    title: "",
    category: "",
    status: "",
    startDate: "",
    endDate: "",
    ...filters,
  }

  function handleChange(event) {
    const { name, value } = event.target;
    onChange?.({...currentFilters, [name]: value});
  }

  function clearFilters() {
    onChange?.({
      title: "",
      category: "",
      status: "",
      startDate: "",
      endDate: "",
    })
  }

  return (
    <section className="request-filters-card" aria-label="Filtros e pesquisa">
      <div className="request-filters-heading">
        <div>
          <span className="section-kicker">Filtros e pesquisa</span>
        </div>
      </div>
      <div className="request-filters-grid">
        <label className="request-filter-field request-filter-search">
          <span>Pesquisar</span>
          <input name="title" type="search" placeholder="Pesquisar solicitações..." value={currentFilters.title} onChange={handleChange}/>
        </label>
        <label className="request-filter-field">
          <span>Categoria</span>
          <select name="category" value={currentFilters.category} onChange={handleChange}>
            <option value="">Todas as categorias</option>
            {requestCategoryOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="request-filter-field">
          <span>Status</span>
          <select name="status" value={currentFilters.status} onChange={handleChange}>
            <option value="">Todos os status</option>
            {requestStatusOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="request-filter-field">
          <span>Data inicial</span>
          <input
            name="startDate"
            type="date"
            value={currentFilters.startDate}
            onChange={handleChange}
          />
        </label>
        <label className="request-filter-field">
          <span>Data final</span>
          <input
            name="endDate"
            type="date"
            value={currentFilters.endDate}
            onChange={handleChange}
          />
        </label>
        <button className="clear-filters-button" type="button" onClick={clearFilters}>Limpar filtros</button>
      </div>
    </section>
  )
}

export default RequestFilters
