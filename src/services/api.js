const defaultApiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000';
const API_BASE_URL = (process.env.REACT_APP_API_URL || defaultApiUrl).replace(/\/$/, '');

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        const message = data?.erro || data?.message || `Erro na API (${response.status})`;
        throw new Error(message);
    }

    return data;
}

export const api = {
    listarCategorias: () => request('/categorias/'),
    criarCategoria: (nome) => request('/categorias/', {
        method: 'POST',
        body: JSON.stringify({ nome }),
    }),
    atualizarCategoria: (id, nome) => request(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nome }),
    }),
    excluirCategoria: (id) => request(`/categorias/${id}`, { method: 'DELETE' }),

    listarProjetos: () => request('/projetos/'),
    criarProjeto: (dados) => request('/projetos/', {
        method: 'POST',
        body: JSON.stringify(dados),
    }),
    atualizarProjeto: (id, dados) => request(`/projetos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    }),
    excluirProjeto: (id) => request(`/projetos/${id}`, { method: 'DELETE' }),

    listarRegistros: (projetoId) => request(`/registros/projeto/${projetoId}`),
    criarRegistro: (dados) => request('/registros/', {
        method: 'POST',
        body: JSON.stringify(dados),
    }),
    atualizarRegistro: (id, dados) => request(`/registros/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    }),
    excluirRegistro: (id) => request(`/registros/${id}`, { method: 'DELETE' }),

    listarPessoas: () => request('/pessoas/'),
    criarPessoa: (dados) => request('/pessoas/', {
        method: 'POST',
        body: JSON.stringify(dados),
    }),
    atualizarPessoa: (id, dados) => request(`/pessoas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    }),
    excluirPessoa: (id) => request(`/pessoas/${id}`, { method: 'DELETE' }),
};

export { API_BASE_URL };
