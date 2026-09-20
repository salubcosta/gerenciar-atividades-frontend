import { useState } from 'react';

import Alert from '../components/Alert';
import Card from '../components/Card';
import ListaVazia from '../components/ListaVazia';
import PageHeader from '../components/PageHeader';
import './Style.css';

const formularioInicial = {
    nome: '',
    sobrenome: '',
    email: '',
    cep: '',
    numero: '',
    complemento: '',
};

function Pessoas({ pessoas, onAdicionar, onEditar, onExcluir }) {
    const [modo, setModo] = useState('lista');
    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [alerta, setAlerta] = useState(null);

    const mostrarAlerta = (mensagem, tipo = 'sucesso') => {
        setAlerta({ mensagem, tipo });
        setTimeout(() => setAlerta(null), 6000);
    };

    const abrirFormNovo = () => {
        setEditando(null);
        setFormulario(formularioInicial);
        setModo('form');
    };

    const abrirFormEditar = (pessoa) => {
        setEditando(pessoa);
        setFormulario({
            nome: pessoa.nome || '',
            sobrenome: pessoa.sobrenome || '',
            email: pessoa.email || '',
            cep: pessoa.cep || '',
            numero: pessoa.numero || '',
            complemento: pessoa.complemento || '',
        });
        setModo('form');
    };

    const cancelar = () => {
        setEditando(null);
        setFormulario(formularioInicial);
        setModo('lista');
    };

    const alterarCampo = (campo, valor) => {
        setFormulario((atual) => ({ ...atual, [campo]: valor }));
    };

    const salvar = async () => {
        if (!formulario.nome.trim() || !formulario.sobrenome.trim() || !formulario.email.trim() || !formulario.cep.trim()) {
            mostrarAlerta('Preencha nome, sobrenome, e-mail e CEP.', 'aviso');
            return;
        }

        const dados = {
            ...formulario,
            nome: formulario.nome.trim(),
            sobrenome: formulario.sobrenome.trim(),
            email: formulario.email.trim(),
            cep: formulario.cep.trim(),
            numero: formulario.numero.trim() || null,
            complemento: formulario.complemento.trim() || null,
        };

        try {
            if (editando) {
                await onEditar(editando.id, dados);
                mostrarAlerta('Dados atualizados!');
            } else {
                await onAdicionar(dados);
                mostrarAlerta('Pessoa cadastrada!');
            }
            cancelar();
        } catch (erro) {
            mostrarAlerta(erro.message, 'erro');
        }
    };

    const excluir = async (pessoa) => {
        if (!window.confirm(`Excluir os dados de ${pessoa.nome}?`)) return;
        try {
            await onExcluir(pessoa.id);
            mostrarAlerta('Pessoa excluída!');
        } catch (erro) {
            mostrarAlerta(erro.message, 'erro');
        }
    };

    return (
        <div className="pagina">
            <PageHeader
                titulo="Meus dados"
                subtitulo={`${pessoas.length} pessoa(s) cadastrada(s)`}
                acao={modo === 'lista' && (
                    <button className="btn btn-primario" onClick={abrirFormNovo}>
                        + Adicionar dados
                    </button>
                )}
            />

            <Alert tipo={alerta?.tipo} mensagem={alerta?.mensagem} />

            {modo === 'lista' && (
                <div className="lista-grid">
                    {pessoas.length === 0 && <ListaVazia mensagem="Nenhum dado pessoal cadastrado." />}
                    {pessoas.map((pessoa) => (
                        <Card
                            key={pessoa.id}
                            titulo={`${pessoa.nome} ${pessoa.sobrenome}`}
                            subtitulo={pessoa.email}
                            rodape={(
                                <>
                                    <p className="pessoa-endereco">
                                        {pessoa.logradouro || 'Logradouro não informado'}{pessoa.numero ? `, ${pessoa.numero}` : ''}
                                        {pessoa.complemento ? `, ${pessoa.complemento}` : ''}
                                        <br />
                                        {pessoa.bairro || 'Bairro não informado'} - {pessoa.cidade}/{pessoa.uf}
                                        <br />CEP: {pessoa.cep}
                                    </p>
                                    <button className="btn btn-secundario" onClick={() => abrirFormEditar(pessoa)}>Editar</button>
                                    <button className="btn btn-perigo" onClick={() => excluir(pessoa)}>Excluir</button>
                                </>
                            )}
                        />
                    ))}
                </div>
            )}

            {modo === 'form' && (
                <div className="form-card">
                    <h2 className="form-titulo">{editando ? 'Editar meus dados' : 'Adicionar meus dados'}</h2>
                    {['nome', 'sobrenome', 'email', 'cep', 'numero', 'complemento'].map((campo) => (
                        <div className="form-grupo" key={campo}>
                            <label className="form-label" htmlFor={`pessoa-${campo}`}>
                                {campo === 'nome' ? 'Nome' : campo === 'sobrenome' ? 'Sobrenome' : campo === 'email' ? 'E-mail' : campo === 'cep' ? 'CEP' : campo === 'numero' ? 'Número' : 'Complemento'}
                            </label>
                            <input
                                id={`pessoa-${campo}`}
                                className="form-input"
                                type={campo === 'email' ? 'email' : 'text'}
                                placeholder={campo === 'cep' ? '00000-000' : campo === 'numero' ? 'Opcional' : ''}
                                value={formulario[campo]}
                                onChange={(evento) => alterarCampo(campo, evento.target.value)}
                            />
                        </div>
                    ))}
                    <p className="form-ajuda">O endereço será preenchido automaticamente a partir do CEP informado.</p>
                    <div className="form-acoes">
                        <button className="btn btn-secundario" onClick={cancelar}>Cancelar</button>
                        <button className="btn btn-primario" onClick={salvar}>Salvar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pessoas;
