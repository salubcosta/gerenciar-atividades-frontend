import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import Rodape from './components/Rodape';
import AppRoutes from './routes/AppRoutes';
import { api } from './services/api';

import './App.css';

const App = () => {
    const [categorias, setCategorias] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [pessoas, setPessoas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [dadosCarregados, setDadosCarregados] = useState(false);
    const [erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro('');

        try {
            const [categoriasResponse, projetosResponse, pessoasResponse] = await Promise.all([
                api.listarCategorias(),
                api.listarProjetos(),
                api.listarPessoas(),
            ]);
            const projetosApi = projetosResponse.projetos || [];
            const registrosResponse = await Promise.all(
                projetosApi.map((projeto) => api.listarRegistros(projeto.id))
            );

            setCategorias(categoriasResponse.categorias || []);
            setProjetos(projetosApi);
            setAtividades(registrosResponse.flatMap((resposta) => resposta.registros || []));
            setPessoas(pessoasResponse.pessoas || []);
        } catch (error) {
            setErro(error.message || 'Não foi possível carregar os dados da API.');
        } finally {
            setCarregando(false);
            setDadosCarregados(true);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const executar = async (acao) => {
        await acao();
        await carregarDados();
    };

    const handlers = {
        adicionarCategoria: (nome) => executar(() => api.criarCategoria(nome)),
        editarCategoria: (id, nome) => executar(() => api.atualizarCategoria(id, nome)),
        excluirCategoria: (id) => executar(() => api.excluirCategoria(id)),
        adicionarProjeto: (nome, descricao, categoria) => executar(() => api.criarProjeto({ nome, descricao, categoria_id: categoria.id })),
        editarProjeto: (id, nome, descricao, categoria) => executar(() => api.atualizarProjeto(id, { nome, descricao, categoria_id: categoria.id })),
        excluirProjeto: (id) => executar(() => api.excluirProjeto(id)),
        adicionarAtividade: (descricao, projeto) => executar(() => api.criarRegistro({ descricao, projeto_id: projeto.id })),
        editarAtividade: (id, descricao) => executar(() => api.atualizarRegistro(id, { descricao })),
        excluirAtividade: (id) => executar(() => api.excluirRegistro(id)),
        adicionarPessoa: (dados) => executar(() => api.criarPessoa(dados)),
        editarPessoa: (id, dados) => executar(() => api.atualizarPessoa(id, dados)),
        excluirPessoa: (id) => executar(() => api.excluirPessoa(id)),
    };

    return (
        <BrowserRouter>
            <Header onAtualizar={carregarDados} carregando={carregando} />
            <main>
                {!dadosCarregados && carregando && <p className="estado-aplicacao">Carregando dados...</p>}
                {erro && (
                    <div className="estado-aplicacao estado-erro">
                        <p>{erro}</p>
                        <button className="btn btn-primario" onClick={carregarDados}>Tentar novamente</button>
                    </div>
                )}
                {dadosCarregados && (
                    <AppRoutes categorias={categorias} projetos={projetos} atividades={atividades} pessoas={pessoas} handlers={handlers} />
                )}
            </main>
            <Rodape />
        </BrowserRouter>
    );
};

export default App;