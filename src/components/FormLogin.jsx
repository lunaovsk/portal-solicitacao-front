import { authService } from "../service/authService";
import { useState } from "react";


const FormLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await authService.login({ username, password });
            if (authService.isAuthenticated()) {
                onLoginSuccess?.();
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Usuário ou senha inválidos.");
        }
    }
    return (
        <div>
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Acesso ao Portal de solicitações Internas</h2>
                <div className="form-group">
                    <label className="form-label">Usuário</label>
                    <input 
                        id="username" 
                        type="text" value={username} 
                        onChange={(event) => setUsername(event.target.value)} 
                        placeholder="Digite seu usuário" required 
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input 
                        id="password" type="password" 
                        value={password} onChange={(event) => setPassword(event.target.value)} 
                        placeholder="Digite sua senha" required 
                    />
                </div>
                <button type="submit" className="btn-login">Entrar</button>
            </form>
        </div>
    );
}

export default FormLogin;
