// Component Navigation.jsx
// Links de navegação entre as páginas
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';


const Navigation = () => {
    const links = [
        { to: '/', label: 'Início' },
        { to: '/categorias', label: 'Categorias' },
        { to: '/projetos', label: 'Projetos' },
        { to: '/pessoas', label: 'Meus dados' },
    ]
    const location = useLocation();

    return (
        <nav>
            {links.map((link)=>(
                <Link
                    key={link.to}
                    to={link.to}
                    className={location.pathname === link.to ? 'nav-link ativo': 'nav-link'}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}

export default Navigation;