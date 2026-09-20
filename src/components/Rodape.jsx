import { Link } from 'react-router-dom';

const Rodape = () => {

    const link = {
        to: "https://especializacao.ccec.puc-rio.br/especializacao/desenvolvimento-full-stack",
        label: "@PUCRio"
    }

    return (
        <footer>
            <div className="rodape">
                <p>
                    MVP Sprint 3 - Desenvolvimento Backend Avançado
                </p>
                <p>
                    Pós-graduação Desenvolvimento Full Stack &nbsp;
                    <Link
                        key={link.to}
                        to={link.to}
                        target='_blank'
                    >
                        {link.label}
                    </Link>
                </p>
            </div>
        </footer>
    );
}

export default Rodape;