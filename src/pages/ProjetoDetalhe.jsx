// ProjetoDetalhe.jsx
// Exibe os detalhes de um projeto e lista suas atividades.
// As atividades são filtradas do array global pelo projeto.id.
//
// Hooks de navegação usados:
//   useParams   — captura o :id da URL (/projetos/1)
//   useNavigate — volta para a lista de projetos

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Card  from '../components/Card';
import Alert from '../components/Alert';
import PageHeader from '../components/PageHeader';
import ListaVazia from '../components/ListaVazia';

import './Style.css';

function ProjetoDetalhe({ projetos, atividades, onAdicionarAtividade, onEditarAtividade, onExcluirAtividade }) {
    // useParams lê o parâmetro :id definido na rota /projetos/:id
    const { id } = useParams();
    const navigate = useNavigate();

    // Busca o projeto pelo id da URL (id vem como string, convertemos com Number)
    const projeto = projetos.find((p) => p.id === Number(id));

    // Filtra apenas as atividades deste projeto
    const atividadesDoProjeto = atividades.filter((a) => a.projeto.id === Number(id));

    const [modo, setModo]           = useState('lista');
    const [editando, setEditando]   = useState(null);
    const [descricao, setDescricao] = useState('');
    const [alerta, setAlerta]       = useState(null);

    const mostrarAlerta = (mensagem, tipo = 'sucesso') => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta(null), 6000);
    };

    // Projeto não encontrado (URL inválida)
    if (!projeto) {
        return (
        <div className="pagina">
            <p className="lista-vazia">Projeto não encontrado.</p>
            <button
            className="btn btn-secundario"
            onClick={() => navigate('/projetos')}
            style={{ marginTop: 12 }}
            >
            ← Voltar para Projetos
            </button>
        </div>
        );
    }

    const abrirFormNovo = () => {
        setEditando(null);
        setDescricao('');
        setModo('form');
    };

    const abrirFormEditar = (ativ) => {
        setEditando(ativ);
        setDescricao(ativ.descricao);
        setModo('form');
    };

    const cancelar = () => {
        setModo('lista');
        setEditando(null);
        setDescricao('');
    };

    const salvar = () => {
        if (!descricao.trim()) {
        mostrarAlerta('Informe a descrição da atividade.', 'aviso');
        return;
        }
        if (editando) {
        onEditarAtividade(editando.id, descricao.trim());
        mostrarAlerta('Atividade atualizada!');
        } else {
        // Passa o objeto projeto completo para manter o padrão do JSON
        onAdicionarAtividade(descricao.trim(), { id: projeto.id, nome: projeto.nome });
        mostrarAlerta('Atividade adicionada!');
        }
        cancelar();
    };

    const excluir = (ativId) => {
        onExcluirAtividade(ativId);
        mostrarAlerta('Atividade excluída!');
    };

    const formatarData = (str) =>
        new Date(str).toLocaleDateString('pt-BR');

    return (
        <div className="pagina">

        <button
            className="btn btn-secundario"
            onClick={() => navigate('/projetos')}
            style={{ marginBottom: 20 }}
        >
            ← Voltar para Projetos
        </button>
        
        {/* Cabeçalho da página — reutiliza PageHeader */}
        <PageHeader
            titulo={projeto.nome}
            subtitulo={`${projeto.categoria.nome} · ${atividadesDoProjeto.length} atividade(s)`}
            acao={
                modo === 'lista' && (
                    <button className="btn btn-primario" onClick={abrirFormNovo}>
                        + Nova atividade
                    </button>
                )
            }
        />

        {/* Descrição do projeto — exibida abaixo do PageHeader */}
        <p style={{ fontSize: '0.9rem', color: '#555', marginTop: -16, marginBottom: 20 }}>
            {projeto.descricao}
        </p>


        <Alert tipo={alerta?.tipo} mensagem={alerta?.mensagem} />

        {/* ── LISTA DE ATIVIDADES ── */}
        {modo === 'lista' && (
            <div className="lista-grid">
            {atividadesDoProjeto.length === 0 && (
                // Componente reutilizável apenas para informar mensagem ao usuário
                <ListaVazia mensagem={"Nenhuma atividade registrada neste projeto. :("} />
            )}
            {atividadesDoProjeto.map((ativ) => (
                <Card
                key={ativ.id}
                titulo={ativ.descricao}
                subtitulo={`Data: ${formatarData(ativ.data)}`}
                rodape={
                    <>
                    <button className="btn btn-secundario" onClick={() => abrirFormEditar(ativ)}>
                        Editar
                    </button>
                    <button className="btn btn-perigo" onClick={() => excluir(ativ.id)}>
                        Excluir
                    </button>
                    </>
                }
                />
            ))}
            </div>
        )}

        {/* ── FORMULÁRIO DE ATIVIDADE ── */}
        {modo === 'form' && (
            <div className="form-card">
            <h2 className="form-titulo">
                {editando ? 'Editar Atividade' : 'Nova Atividade'}
            </h2>

            <div className="form-grupo">
                <label className="form-label" htmlFor="desc-ativ">Descrição</label>
                <textarea
                id="desc-ativ"
                className="form-input"
                rows={3}
                placeholder="Descreva a atividade realizada..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                autoFocus
                />
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

export default ProjetoDetalhe;
