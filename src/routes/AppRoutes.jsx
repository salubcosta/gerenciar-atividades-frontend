// AppRoutes.jsx
// Define todas as rotas da aplicação em um único lugar.
// Recebe categorias, projetos, atividades e handlers vindos do App.js

import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Categorias     from '../pages/Categorias';
import Projetos from '../pages/Projetos';
import ProjetoDetalhe from '../pages/ProjetoDetalhe';
import Pessoas from '../pages/Pessoas';
import NotFound from '../pages/NotFound';

const AppRoutes = ({ categorias, projetos, atividades, pessoas, handlers }) => {
    return (
        <Routes>
            {/* Rota home */}
            <Route 
                path='/'
                element={
                    <Home
                        categorias={categorias}
                        projetos={projetos}
                        atividades={atividades}
                    />
                }
            />

            {/* Rota categorias */}
            <Route
                path="/categorias"
                element={
                    <Categorias
                        categorias={categorias}
                        projetos={projetos}
                        onAdicionar={handlers.adicionarCategoria}
                        onEditar={handlers.editarCategoria}
                        onExcluir={handlers.excluirCategoria}
                    />
                }
            />

            {/* Rota projetos */}
            <Route
                path="/projetos"
                element={
                    <Projetos
                        projetos={projetos}
                        categorias={categorias}
                        atividades={atividades}
                        onAdicionar={handlers.adicionarProjeto}
                        onEditar={handlers.editarProjeto}
                        onExcluir={handlers.excluirProjeto}
                    />
                }
            />
            {/* Rota de projetos por ID e detalhes (as atividades de cada projeto) */}
            {/* :id é o parâmetro dinâmico lido com useParams em ProjetoDetalhe */}
            <Route
                path="/projetos/:id"
                element={
                <ProjetoDetalhe
                    projetos={projetos}
                    categorias={categorias}
                    atividades={atividades}
                    onAdicionarAtividade={handlers.adicionarAtividade}
                    onEditarAtividade={handlers.editarAtividade}
                    onExcluirAtividade={handlers.excluirAtividade}
                />
                }
            />

            <Route
                path="/pessoas"
                element={
                    <Pessoas
                        pessoas={pessoas}
                        onAdicionar={handlers.adicionarPessoa}
                        onEditar={handlers.editarPessoa}
                        onExcluir={handlers.excluirPessoa}
                    />
                }
            />

            {/* Rota 404 - captura qualquer URL não mapeada acima */}
            <Route 
                path="*" 
                element={<NotFound />} 
            />
        </Routes>
    );
}

export default AppRoutes;