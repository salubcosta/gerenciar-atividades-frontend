# Atividades por Projetos

Aplicação React para gerenciamento de atividades organizadas por projetos e categorias, integrada à API Flask do backend, disponível em: [gerenciar-atividades-backend-api](https://github.com/salubcosta/gerenciar-atividades-backend-api).

## Descrição

O sistema permite cadastrar **categorias**, **projetos**, **atividades** e **meus dados**. As operações de criação, edição, consulta e exclusão são persistidas pela API backend. O endereço da pessoa é preenchido pelo backend a partir do CEP consultado pela API Externa do ViaCEP (<i>toda manipulação é realizada no backend</i>)

## Tecnologias

- React 19
- React Router DOM v7
- JavaScript
- CSS por componente
- Fetch API para comunicação HTTP
- Nginx para servir a aplicação em produção

## Funcionalidades

- **Categorias** — listar, adicionar, editar e excluir. Proteção contra exclusão de categoria em uso por algum projeto.
- **Projetos** — listar com filtro por categoria, adicionar, editar e excluir. Proteção contra exclusão de projeto que possui atividades. Clique em um projeto navega para o detalhe.
- **Atividades** — gerenciadas dentro do detalhe de cada projeto; permite adicionar, editar e excluir atividades vinculadas ao projeto.
- **Meus dados** — consulta, cadastro, edição e exclusão de pessoas consumindo `/pessoas` no backend.
- **Navegação integrada** — ao clicar em "Ver projetos" em uma categoria, a página de Projetos abre já filtrada por aquela categoria (via `useNavigate` / `state`). Ao criar um projeto sem categoria cadastrada, há atalho direto para criar uma.
- **Alertas temporários** — feedback visual (sucesso, aviso, erro) com auto-dismiss em 6 segundos.
- **Estado vazio** — componente `ListaVazia` exibido quando não há itens na lista.

## Estrutura de Pastas

```
gerenciar-atividades-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── outros arquivos gerados na criação do projeto react
├── src/
│   ├── App.js               # Raiz: estado global e handlers CRUD
│   ├── App.css
│   ├── index.js
│   ├── components/
│   │   ├── Header.jsx       # Cabeçalho com título e navegação
│   │   ├── Header.css
│   │   ├── Navigation.jsx   # Links de navegação com link ativo
│   │   ├── Navigation.css
│   │   ├── Card.jsx         # Card reutilizável (título, subtítulo, rodapé)
│   │   ├── Card.css
│   │   ├── Alert.jsx        # Alerta de feedback (sucesso / aviso / erro)
│   │   ├── Alert.css
│   │   ├── PageHeader.jsx   # Cabeçalho de página (título + subtítulo + ação)
│   │   ├── ListaVazia.jsx   # Mensagem quando a lista está vazia
│   │   └── Rodape.jsx       # Rodapé da aplicação
│   ├── services/
│   │   └── api.js           # Cliente HTTP para a API backend
│   ├── pages/
│   │   ├── Home.jsx         # Página inicial com resumo de categorias, projetos e atividades
│   │   ├── Home.css
│   │   ├── Categorias.jsx   # CRUD de categorias
│   │   ├── Projetos.jsx     # CRUD de projetos com filtro por categoria
│   │   ├── ProjetoDetalhe.jsx # Detalhe do projeto + CRUD de atividades
│   │   ├── Pessoas.jsx       # CRUD dos dados pessoais
│   │   ├── NotFound.jsx     # Página 404
│   │   ├── NotFound.css
│   │   └── Style.css        # Estilos compartilhados entre páginas
│   └── routes/
│       └── AppRoutes.jsx    # Definição centralizada de rotas
├── package.json
├── Dockerfile                # Build e imagem de produção
├── nginx.conf                # Servidor React e proxy para a API
└── .gitignore
```

O arquivo `src/data/dados.json` foi removido. Categorias, projetos, atividades e pessoas são carregados e persistidos exclusivamente pela API backend.

## Rotas

| Rota            | Páginas           | Descrição                                      |
|-----------------|-------------------|------------------------------------------------|
| `/`             | `Home`            | Resumo de categorias, projetos e atividades    |
| `/categorias`   | `Categorias`      | Listagem e CRUD de categorias                  |
| `/projetos`     | `Projetos`        | Listagem e CRUD de projetos (com filtro)       |
| `/projetos/:id` | `ProjetoDetalhe`  | Detalhe de um projeto e CRUD de atividades     |
| `/pessoas`      | `Pessoas`          | Consulta e CRUD dos dados pessoais             |
| `*`             | `NotFound`        | Página 404 para rotas não mapeadas             |

## Contrato com a API

Durante o desenvolvimento, o frontend é servido em http://localhost:3000 e, por padrão, envia requisições à API em http://localhost:5000. O endereço da API pode ser alterado pela variável REACT_APP_API_URL.

No build Docker, a API é acessada pelo caminho relativo /api. O Nginx recebe essas requisições e as encaminha ao backend na porta 5000

Endpoints utilizados:

| Recurso     | Endpoints principais                                      |
|-------------|------------------------------------------------------------|
| Categorias  | `GET`, `POST`, `PUT` e `DELETE /categorias`               |
| Projetos    | `GET`, `POST`, `PUT` e `DELETE /projetos`                 |
| Atividades  | `POST`, `PUT` e `DELETE /registros`                       |
| Pessoas     | `GET`, `POST`, `PUT` e `DELETE /pessoas`                  |

O cadastro de pessoas envia o CEP ao backend, que consulta o ViaCEP e retorna os dados do endereço. Número, complemento e bairro podem ser nulos.

## Arquitetura da solução <small><i>(Cenário 1.1)</i></small>

Conforme requisito do MVP, a implementação foi construída de acordo com o cenário 1.1, onde temos um frontend que se comunicação com o backend e este, faz a comunicação com API Externa e persiste dados no banco de dados.

Segue desenho da arquitetura:

<img src="https://github.com/salubcosta/gerenciar-atividades-backend-api/blob/main/figure/arquitetura.png?raw=true" width="100%">
<small>Imagem capturada diretamente do repositório que trabalha com o backend</small>

## Instalação e Execução <small><i>(sem o docker)</i></small>

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- npm (incluso com Node.js)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/salubcosta/gerenciar-atividades-frontend.git
cd gerenciar-atividades-frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```
A aplicação estará disponível em <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.

<hr>

# Executando com Docker

O backend e o frontend são projetos independentes, no entanto, é interessante executar o backend para ter uma melhor experiência. Para detalhes de execução do backend, acesse: [gerenciar-atividades-backend-api](https://github.com/salubcosta/gerenciar-atividades-backend-api).

### 1. Efetue o download do projeto ou clone o repositório como exemplificado abaixo:

```bash
# Clone o repositório
git clone https://github.com/salubcosta/gerenciar-atividades-frontend.git

cd gerenciar-atividades-frontend
```

### 2. Dentro o diretório raiz do frontend, construa a imagem:

```bash
docker build -t gerenciar-atividades-frontend .
```

### 3. Crie e execute o container para trabalhar com o frontent. O frontend está na porta `3000`:

```bash
docker run -d --name gerenciar-atividades-frontend -p 3000:80 gerenciar-atividades-frontend
```

### 4. Ao iniciar, o container com o frontend estará disponível em: 
<a href="http://localhost:3000" target="_blank">http://localhost:3000</a>

<hr>

Observações:
- O Nginx serve a aplicação React e encaminha chamadas `/api/*` para `http://host.docker.internal:5000`.
- Importante esclarecer que `http://host.docker.internal:5000` é um endereço especial usado por containers Docker para acessar serviços que estão rodando na máquina hospedeira, neste caso, no Windows.


Um possível fluxo seria este:
```Plain text
Browser → frontend/Nginx (porta:3000) → host.docker.internal:5000 → backend Flask
```

Para parar e remover o container:

```bash
docker stop gerenciar-atividades-frontend 
docker rm gerenciar-atividades-frontend
```

## Autor do projeto

**Salumão Barbosa da Costa**  
Pós-graduando em Desenvolvimento Full Stack na PUC-Rio
