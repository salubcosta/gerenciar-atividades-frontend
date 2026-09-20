// Projetos.jsx
// Lista todos os projetos com filtro por categoria.
// Clicar em um card navega para ProjetoDetalhe.
//
// Hooks de navegação usados:
//   useNavigate — vai para /projetos/:id ao clicar num projeto
//   useLocation — lê categoriaId passado por Categorias via state

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Card  from '../components/Card';
import Alert from '../components/Alert';
import PageHeader from '../components/PageHeader';
import ListaVazia from '../components/ListaVazia';

import './Style.css';

function Projetos({ projetos, categorias, atividades, onAdicionar, onEditar, onExcluir }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [modo, setModo]               = useState('lista');
    const [editando, setEditando]       = useState(null);
    const [nome, setNome]               = useState('');
    const [descricao, setDescricao]     = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [filtroCat, setFiltroCat]     = useState('');
    const [alerta, setAlerta]           = useState(null);

    // Se Categorias passou state { categoriaId }, aplica o filtro automaticamente
    useEffect(() => {
        if (location.state?.categoriaId) {
            setFiltroCat(String(location.state.categoriaId));
        }
    }, [location.state]);

    const mostrarAlerta = (mensagem, tipo = 'sucesso') => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta(null), 6000);
    };

    const abrirFormNovo = () => {
        setEditando(null);
        setNome(''); setDescricao(''); setCategoriaId('');
        setModo('form');
    };

    const abrirFormEditar = (proj) => {
        setEditando(proj);
        setNome(proj.nome);
        setDescricao(proj.descricao);
        setCategoriaId(String(proj.categoria.id));
        setModo('form');
    };

    const cancelar = () => {
        setModo('lista');
        setEditando(null);
        setNome(''); setDescricao(''); setCategoriaId('');
    };

    const salvar = () => {
        if (!nome.trim())      { mostrarAlerta('Informe o nome do projeto.', 'aviso'); return; }
        if (!descricao.trim()) { mostrarAlerta('Informe a descrição.', 'aviso');       return; }
        if (!categoriaId)      { mostrarAlerta('Selecione a categoria.', 'aviso');     return; }

        // Monta o objeto categoria completo para manter o padrão do JSON
        const cat = categorias.find((c) => c.id === Number(categoriaId));
        const categoria = { id: cat.id, nome: cat.nome };

        if (editando) {
            onEditar(editando.id, nome.trim(), descricao.trim(), categoria);
            mostrarAlerta('Projeto atualizado!');
        } else {
            onAdicionar(nome.trim(), descricao.trim(), categoria);
            mostrarAlerta('Projeto adicionado!');
        }
        cancelar();
    };

    const excluir = (proj) => {
        const temAtividades = atividades.some((a) => a.projeto.id === proj.id);
        if (temAtividades) {
            mostrarAlerta('Não é possível excluir: projeto possui atividades.', 'erro');
            return;
        }
        onExcluir(proj.id);
        mostrarAlerta('Projeto excluído!');
    };

    const projetosFiltrados = filtroCat
    ? projetos.filter((p) => String(p.categoria.id) === filtroCat)
    : projetos;

    return (
        <div className="pagina">
            {/* Cabeçalho da página — reutiliza PageHeader */}
            <PageHeader
                titulo="Projetos"
                subtitulo={`${projetos.length} cadastrado(s)`}
                acao={
                modo === 'lista' && (
                    <button className="btn btn-primario" onClick={abrirFormNovo}>
                    + Novo projeto
                    </button>
                )
                }
            />


            <Alert tipo={alerta?.tipo} mensagem={alerta?.mensagem} />

            {/* ── LISTA ── */}
            {modo === 'lista' && (
            <>
                <div style={{ marginBottom: 16 }}>
                <select
                    className="form-input"
                    style={{ maxWidth: 260 }}
                    value={filtroCat}
                    onChange={(e) => setFiltroCat(e.target.value)}
                >
                    <option value="">Todas as categorias</option>
                    {categorias.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.nome}</option>
                    ))}
                </select>
                </div>

                <div className="lista-grid">
                {projetosFiltrados.length === 0 && (
                    // Componente reutilizável apenas para informar mensagem ao usuário
                    <ListaVazia mensagem={"Nenhum projeto encontrado. :("} />
                )}
                {projetosFiltrados.map((proj) => {
                    const qtdAtiv = atividades.filter((a) => a.projeto.id === proj.id).length;
                    return (
                    <Card
                        key={proj.id}
                        titulo={proj.nome}
                        subtitulo={`${proj.categoria.nome} · ${qtdAtiv} atividade(s)`}
                        onClick={() => navigate(`/projetos/${proj.id}`)}
                        rodape={
                        <>
                            <button className="btn btn-secundario" onClick={() => abrirFormEditar(proj)}>
                            Editar
                            </button>
                            <button className="btn btn-perigo" onClick={() => excluir(proj)}>
                            Excluir
                            </button>
                        </>
                        }
                    />
                    );
                })}
                </div>
            </>
            )}

            {/* ── FORMULÁRIO ── */}
            {modo === 'form' && (
            <div className="form-card">
                <h2 className="form-titulo">
                {editando ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>

                <div className="form-grupo">
                <label className="form-label" htmlFor="nome-proj">Nome</label>
                <input
                    id="nome-proj"
                    className="form-input"
                    type="text"
                    placeholder="Ex: Site Institucional"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoFocus
                />
                </div>

                <div className="form-grupo">
                <label className="form-label" htmlFor="desc-proj">Descrição</label>
                <textarea
                    id="desc-proj"
                    className="form-input"
                    rows={3}
                    placeholder="Descreva o projeto..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                </div>

                <div className="form-grupo">
                <label className="form-label" htmlFor="cat-proj">Categoria</label>
                {categorias.length === 0 ? (
                    <p className="lista-vazia">
                    Nenhuma categoria cadastrada.{' '}
                    <button
                        className="link-btn"
                        onClick={() => navigate('/categorias', { state: { acao: 'novo' } })}
                    >
                        Criar uma categoria
                    </button>
                    </p>
                ) : (
                    <select
                    id="cat-proj"
                    className="form-input"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    >
                    <option value="">Selecione...</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={String(c.id)}>{c.nome}</option>
                    ))}
                    </select>
                )}
                </div>

                <div className="form-acoes">
                <button className="btn btn-secundario" onClick={cancelar}>Cancelar</button>
                <button className="btn btn-primario"   onClick={salvar}>Salvar</button>
                </div>
            </div>
            )}

        </div>
    );
    }

export default Projetos;
