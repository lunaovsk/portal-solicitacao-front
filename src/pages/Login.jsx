import { useNavigate } from "react-router-dom";
import FormLogin from "../components/FormLogin";
import { authService } from "../service/authService";


const Login = () => {
    const navigate = useNavigate();
    
    return (
        <main className="login-page">
            <h1>Portal Solicitações Internas</h1>
            <p>Entre usando seu usuário e senha cadastrados.</p>
            <FormLogin onLoginSuccess={() => navigate(authService.getHomePath(), { replace: true })} />
        </main>
    );
};

export default Login;
