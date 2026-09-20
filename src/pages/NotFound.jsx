// NotFound.jsx
// Página 404 — exibida quando o usuário acessa uma URL inexistente.
//
// Hooks de navegação usados aqui:
//   useLocation — mostra qual URL inválida foi acessada
//   useNavigate — volta para o início

import { useLocation, useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
// useLocation retorna a URL atual, incluindo o pathname
const location = useLocation();
const navigate = useNavigate();

return (
    <div className="notfound">
    <h1 className="notfound-codigo">404</h1>
    <h2 className="notfound-titulo">Página não encontrada</h2>
    <p className="notfound-url">
        A URL <code>{location.pathname}</code> não existe nesta aplicação.
    </p>
    <button className="btn btn-primario" onClick={() => navigate('/')}>
        ← Voltar ao início
    </button>
    </div>
);
}

export default NotFound;
