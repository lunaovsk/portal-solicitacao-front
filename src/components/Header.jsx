import "../theme/Header.css";

function Header({ user, onCreateRequest, onLogout }) {
    return (
        <header className="header">
            <div className="header-inner">
                <a className="header-brand" href="/" aria-label="Portal de Solicitação">
                    <span>
                        Portal de solicitação Interno
                    </span>
                </a>

                <div className="header-actions">
                    <span className="header-user">{user?.sub || "Seu nome"}</span>
                    {onCreateRequest && (
                        <button className="primary-button" type="button" onClick={onCreateRequest}>
                            Nova solicitação
                        </button>
                    )}
                    <button className="logout-button" type="button" onClick={onLogout}>Sair</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
