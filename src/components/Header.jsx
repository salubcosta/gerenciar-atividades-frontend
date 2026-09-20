import Navigation from './Navigation';
import './Header.css';

const Header = ({ onAtualizar, carregando }) => {

    return (
        <header className="header">
            <span className="header-titulo">Atividades por <strong>Projetos</strong></span>
            <div className="header-acoes">
                <Navigation />
                <button
                    className="btn-atualizar"
                    type="button"
                    onClick={onAtualizar}
                    disabled={carregando}
                    title="Atualizar dados da API"
                >
                    {carregando ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>
        </header>
    );
}

export default Header;