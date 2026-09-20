// Card.jsx
// Componente será reutilizável para exibir qualquer item (categoria, projeto, atividade)
// 
// Props:
// titulo       - texto principal do card
// subtitulo    - texto menor logo abaixo do título
// rodape       - conteúdo no rodape do card, tipo botões
// onClick      - se for passado por parâmetro, o card inteiro fica clicável

import './Card.css';

const Card = ({ titulo, subtitulo, rodape, onClick}) => {
    return (
        <div
            className={`card ${onClick ? 'card-clicavel': ''}`}
            onClick={onClick}
        >
            <div className='card-corpo'>
                <h3 className='card-titulo'>{titulo}</h3>
                {subtitulo && <p className='card-subtitulo'>{subtitulo}</p>}
            </div>

            {/* Rodapé do card só aparece se for passado como prop */}
            {rodape && (
                <div 
                    className='card-rodape'
                    // Impede que o clique nos botões do rodapé dispare o onclic do card
                    onClick={(e)=> e.stopPropagation()}
                >
                    {rodape}
                </div>
            )}
        </div>
    );
}

export default Card;