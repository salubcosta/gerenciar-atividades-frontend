// Componente simples para informar mensagem ao usuário

// Props:
// mensagem - informação passada se não há categoria, projetos ou atividades

const ListaVazia = ( { mensagem }) => {
    return(
        <p className="lista-vazia">
            {mensagem}
        </p>
    );
};

export default ListaVazia;