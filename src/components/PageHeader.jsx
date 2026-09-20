// Cabeçalho reutilizável de cada página interna.
// Exibe título, subtítulo opcional e uma ação opcional (Exemplo: botão "Novo")

// Props:
// titulo       - texto principal
// subtitulo    - texto menor abaixo do título
// acao         - elemento jsx exibido à direita, por exemplo, um botão

const PageHeader = ({ titulo, subtitulo, acao}) => {
    return (
        <div className="pagina-header">
            <div>
                <h1 className="pagina-titulo">{titulo}</h1>
                {subtitulo && <p className="pagina-subtitulo">{subtitulo}</p>}
            </div>
            {acao && <div>{acao}</div>}
        </div>
    );
};

export default PageHeader;