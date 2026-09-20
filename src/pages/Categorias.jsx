// Categorias.jsx
// Lista, adiciona, edita e exclui categorias.
//
// Hook de navegação usado: useLocation — lê o estado passado por navigate()
// (ex: { acao: 'novo' } para abrir o formulário automaticamente).

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes reutilizados
import Card  from '../components/Card';
import Alert from '../components/Alert';
import PageHeader from '../components/PageHeader';
import ListaVazia from '../components/ListaVazia';
import './Style.css';

function Categorias({ categorias, projetos, onAdicionar, onEditar, onExcluir }) {
	const location = useLocation(); // lê o estado enviado por outra página
	const navigate = useNavigate();

	const [modo, setModo]         = useState('lista');
	const [editando, setEditando] = useState(null);
	const [nome, setNome]         = useState('');
	const [alerta, setAlerta]     = useState(null);

	// Se outra página navegou com state { acao: 'novo' }, abre o form direto
	useEffect(() => {
		if (location.state?.acao === 'novo') abrirFormNovo();
	}, [location.state]);

	const mostrarAlerta = (mensagem, tipo = 'sucesso') => {
		setAlerta({ mensagem, tipo });
		setTimeout(() => setAlerta(null), 6000);
	};

	const abrirFormNovo = () => {
		setEditando(null);
		setNome('');
		setModo('form');
	};

	const abrirFormEditar = (cat) => {
		setEditando(cat);
		setNome(cat.nome);
		setModo('form');
	};

	const cancelar = () => {
		setModo('lista');
		setEditando(null);
		setNome('');
	};

	const salvar = () => {
		if (!nome.trim()) {
			mostrarAlerta('Informe o nome da categoria.', 'aviso');
			return;
		}
		if (editando) {
			onEditar(editando.id, nome.trim());
			mostrarAlerta('Categoria atualizada!');
		} else {
			onAdicionar(nome.trim());
			mostrarAlerta('Categoria adicionada!');
		}
		cancelar();
	};

	const excluir = (cat) => {
		const emUso = projetos.some((p) => p.categoria.id === cat.id);
		if (emUso) {
			mostrarAlerta('Não é possível excluir: categoria em uso por um projeto.', 'erro');
			return;
		}
		onExcluir(cat.id);
		mostrarAlerta('Categoria excluída!');
	};

	return (
		<div className="pagina">

			{/* Cabeçalho da página - reutiliza pageheader */}
			<PageHeader 
				titulo="Categorias"
				subtitulo={`${categorias.length} cadastrada(s)`}
				acao={
				modo === 'lista' && (
					<button className="btn btn-primario" onClick={abrirFormNovo}>
					+ Nova categoria
					</button>
				)
				}
			/>

			<Alert tipo={alerta?.tipo} mensagem={alerta?.mensagem} />

			{/* ── LISTA ── */}
			{modo === 'lista' && (
			<div className="lista-grid">
				{categorias.length === 0 && (
				// Componente reutilizável apenas para informar mensagem ao usuário
				<ListaVazia mensagem="Nenhuma categoria cadastrada. :(" />
				// <p className="lista-vazia">Nenhuma categoria cadastrada.</p>
				)}
				{categorias.map((cat) => {
				const qtd = projetos.filter((p) => p.categoria.id === cat.id).length;
				return (
					<Card
					key={cat.id}
					titulo={cat.nome}
					subtitulo={`${qtd} projeto(s) nesta categoria`}
					rodape={
						<>
							<button className="btn btn-secundario" onClick={() => abrirFormEditar(cat)}>
								Editar
							</button>
							<button className="btn btn-perigo" onClick={() => excluir(cat)}>
								Excluir
							</button>
							<button
								className="btn btn-aviso"
								onClick={() => navigate('/projetos', { state: { categoriaId: cat.id } })}
							>
								Ver projetos
							</button>
						</>
					}
					/>
				);
				})}
			</div>
			)}

			{/* ── FORMULÁRIO ── */}
			{modo === 'form' && (
			<div className="form-card">
				<h2 className="form-titulo">
				{editando ? 'Editar Categoria' : 'Nova Categoria'}
				</h2>

				<div className="form-grupo">
				<label className="form-label" htmlFor="nome-cat">Nome</label>
				<input
					id="nome-cat"
					className="form-input"
					type="text"
					placeholder="Ex: Desenvolvimento"
					value={nome}
					onChange={(e) => setNome(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && salvar()}
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

export default Categorias;
