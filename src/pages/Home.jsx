// Home.jsx
// Página inicial com resumo de cada seçãoda aplicação
// 
// Hook de navegação usado aqui:
// useNavigate - redireciona para outra rota quando o usuário clica em um card

import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './Home.css';

const Home = ({ categorias, projetos, atividades }) => {
    const navigate = useNavigate();

    const cards = [
        {
            titulo: 'Categorias',
            descricao: `${categorias.length} cadastrada(s) - Agrupe seus projetos por categoria.`,
            rota: '/categorias'
        }, {
            titulo: 'Projetos',
            descricao: `${projetos.length} cadastrado(s) - Gerencie projetos vinculados à categoria.`,
            rota: '/projetos'
        }, {
            titulo: 'Atividades',
            descricao: `${atividades.length} cadastrada(s) - Acesse um projeto para ver suas atividades.`,
            rota: '/projetos'
        },
    ];

    return (
        <div>
            {/* Cabeçalho da home */}
            <div className='home-header'>
                <h1 className='home-titulo'>
                    Gerenciamento de atividades por <span className='home-destaque'>Projetos</span>
                </h1>
                <p className='home-subtitulo'>Organize categorias, projetos e atividades em um só lugar.</p>
            </div>
            {/* Cards de navegação */}
            <div className='home-grid'>
                {
                    cards.map(card => (
                        <Card 
                            key={card.titulo}
                            titulo={card.titulo}
                            subtitulo={card.descricao}
                            onClick={()=>navigate(card.rota)}
                            rodape={
                                <button 
                                    className='btn btn-secondary'
                                    onClick={()=>navigate(card.rota)}
                                >
                                    Ver todos
                                </button>
                            }
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Home;