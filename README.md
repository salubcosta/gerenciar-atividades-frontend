# Atividades por Projetos

Aplicação React para gerenciamento de atividades organizadas por projetos e categorias, integrada à API Flask do backend, disponível em: [Gerenciar-atividades-backend-api](https://github.com/salubcosta/gerenciar-atividades-backend-api).

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
│   │   ├── Home.jsx         # Página hoje com resumo de categorias, projetos e atividades
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
├── Dockerfile                # Build, testes e imagem de produção
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

Por padrão, durante o desenvolvimento, o frontend acessa `http://localhost:5000`. A URL pode ser alterada pela variável `REACT_APP_API_URL`.

No build Docker, o frontend usa `/api`, encaminhado pelo Nginx para o backend na porta `5000`.

Endpoints utilizados:

| Recurso     | Endpoints principais                                      |
|-------------|------------------------------------------------------------|
| Categorias  | `GET`, `POST`, `PUT` e `DELETE /categorias`               |
| Projetos    | `GET`, `POST`, `PUT` e `DELETE /projetos`                 |
| Atividades  | `POST`, `PUT` e `DELETE /registros`                       |
| Pessoas     | `GET`, `POST`, `PUT` e `DELETE /pessoas`                  |

O cadastro de pessoas envia o CEP ao backend, que consulta o ViaCEP e retorna os dados do endereço. Número, complemento e bairro podem ser nulos.

## Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- npm (incluso com Node.js)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/salubcosta/frontend-projetos-react.git
cd frontend-projetos-react

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
```
A aplicação estará disponível em `http://localhost:3000`.

### Executando com Docker

O backend e o frontend são projetos independentes, localizados em diretórios irmãos:

```text
mvp/
├── gerenciar-atividades-backend-api/
└── gerenciar-atividades-frontend/
```

Primeiro, na pasta `gerenciar-atividades-backend-api`, construa e execute a API:

```bash
docker build -t gerenciar-atividades .
docker run -d --name gerenciar-atividades-backend -p 5000:5000 gerenciar-atividades
```

Em outro terminal, entre na pasta irmã `gerenciar-atividades-frontend` e construa a imagem:

```bash
cd ../gerenciar-atividades-frontend
docker build -t gerenciar-atividades-frontend .
```

Execute o frontend na porta `3000`:

```bash
docker run --rm --name gerenciar-atividades-frontend -p 3000:80 gerenciar-atividades-frontend
```

Acesse `http://localhost:3000`. O Nginx serve a aplicação React e encaminha chamadas `/api/*` para `http://host.docker.internal:5000`.

Para parar os containers:

```bash
docker stop gerenciar-atividades-frontend gerenciar-atividades-backend
docker rm gerenciar-atividades-frontend gerenciar-atividades-backend
```

No desenvolvimento local, execute o backend em `http://localhost:5000` e o frontend com `npm start` em `http://localhost:3000`.

Para executar build e testes dentro do Docker:

```bash
docker build --target test -t gerenciar-atividades-frontend-test .
```

Esse estágio executa `npm run build` e `npm test -- --watchAll=false --passWithNoTests` dentro do container.
