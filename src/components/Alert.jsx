// Alert.jsx
// Exibe uma mensagem de feedback para o usuário.
//
// Props:
//   tipo     — 'sucesso' | 'erro' | 'aviso'
//   mensagem — texto a exibir (se for null, não renderiza nada)

import './Alert.css';

function Alert({ tipo = 'sucesso', mensagem }) {
  if (!mensagem) return null;

  return (
    <div className={`alert alert-${tipo}`}>
      {mensagem}
    </div>
  );
}

export default Alert;
