# Interface - Portal de Solicitações Internas

Interface web (Frontend) desenvolvida em React para o Portal de Solicitações Internas. Esta aplicação consome a API REST do projeto e fornece uma interface responsiva, componentizada e segura para que os colaboradores abram chamados e os atendentes gerenciem as demandas.

*obs: O backend (API) não faz parte deste repositório.*

## Requisitos do projeto (Implementados)

- Tela de Login interativa e responsiva.
- Controle de Sessão e Rotas Protegidas baseadas na validação do JWT salvo no armazenamento local.
- Extração de perfis de forma *stateless* a partir do payload do JWT decodificado no frontend.
- Renderização condicional de ações baseada no perfil logado (`REQUESTER` ou `ATTENDANT`).
- Dashboard com indicadores lidos diretamente da API.
- Tabela de chamados com ações contextuais: botões são desabilitados caso a solicitação não esteja mais no status `OPEN`.
- Modal reaproveitável (Modo Leitura e Modo Edição) sem repetição de código (DRY).
- Sistema de Filtros para busca de chamados por texto, datas, categorias e status.
- Tema unificado com *CSS Custom Properties* (Variáveis nativas) para facilitar expansões futuras.

## Tecnologias

| Item | Tecnologia |
| --- | --- |
| Linguagem | JavaScript (ES6+) |
| Biblioteca Base | React (v18) |
| Build & Bundler | Vite |
| Roteamento | React Router DOM |
| Estilização | CSS3 Puro (com CSS Variables) |
| Comunicação HTTP | Fetch API (encapsulada em um Custom Client) |
| Gerenciador de Pacotes| NPM (ou Yarn) |

## Pré-requisitos

- Node.js (v18 ou superior).
- Repositório do Backend (API Spring Boot) rodando localmente ou em nuvem.
- Git, para clonar o repositório.

## Configuração e execução local

1. Clone o repositório:

   ```bash
   git clone https://github.com/lunaovsk/portal-frontend.git
   cd portal-frontend
   ```

2. Crie um arquivo `.env` na raiz do projeto para fornecer a URL da sua API Backend local (ou de produção). O `.env` é carregado pelo Vite e deve seguir este formato:

   ```properties
   VITE_API_URL=http://localhost:8080/api/v1
   ```
   > **Atenção:** As variáveis de ambiente no Vite devem obrigatoriamente começar com o prefixo `VITE_` para ficarem expostas na aplicação.

3. Instale as dependências:

   **Usando NPM:**
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   O Frontend ficará disponível em `http://localhost:5173`. O servidor do Vite suporta *Hot Module Replacement* (HMR), então edições de código são refletidas quase instantaneamente no navegador.

### Build de Produção

Para compilar o código minificado e otimizado para deploy em servidores estáticos (como Vercel, Netlify ou Nginx):

```bash
npm run build
```
O artefato final será gerado dentro da pasta `dist/`.

## Autenticação e Gestão de Estado

Quando o usuário faz o login, o frontend dispara uma requisição de autenticação para a API. Recebendo o retorno HTTP `200 OK`, a aplicação:

1. Armazena o token recebido de forma persistente no `localStorage`.
2. Decodifica o base64 do payload do JWT em memória (através do serviço `authService.js`) para descobrir instantaneamente a *role* (`SCOPE_ROLE_REQUESTER` ou `SCOPE_ROLE_ATTENDANT`) e o email do usuário logado.
3. Injeta automaticamente esse token JWT (via header `Authorization: Bearer <token>`) em todas as requisições subsequentes através do interceptador programado no `apiClient.js`.

O logout limpa os dados da sessão local e redireciona o usuário para a tela de `/login`.

## Telas e Navegação

| Rota Visual | Acesso | Descrição |
| --- | --- | --- |
| `/login` | Público | Tela de autenticação de usuários. |
| `/` (Home) | Autenticado | Tela principal (Single Page) contendo: **Dashboard**, **Filtros**, **Tabela de Solicitações** e **Modais**. Tudo gerenciado via estados do React. |
| `/*` (Fallback) | Público | Rota curinga. Qualquer URL inexistente força o redirecionamento para o `/login` (ou a tela inicial, se estiver autenticado). |

## Organização do código

A organização da pasta `src/` prioriza a separação de responsabilidades (*Separation of Concerns*).

- Autor: lunaovsk

```text
src/
├── components/       # Componentes de UI reutilizáveis (Header, Table, Modal)
├── data/             # Dicionários de tradução e Options de formulários estáticos
├── pages/            # Componentes conteinerizadores (smart components) ex: Home
├── routing/          # Configuração de rotas e Guardas de autenticação (ProtectedRoute)
├── service/          # Camada de comunicação com a API (Isolamento do Fetch)
└── theme/            # Arquivos de estilização (CSS globais e de componentes)
```

## Arquitetura e Boas Práticas Frontend

- **Isolamento de API:** Os componentes visuais do React não possuem chamadas HTTP espalhadas, todas estão concentradas em serviços (como `requestService.js`), facilitando uma futura substituição de bibliotecas de requisição (como Axios).
- **Tratamento Global de Erros:** O cliente base da API (`apiClient.js`) processa o JSON de erro padronizado do Spring Boot e efetua o *throw* das mensagens limpas para que a interface as mostre ao usuário.
- **Evitando Overfetching:** Quando o usuário clica em "Visualizar", o frontend chama a rota `/api/v1/request/{id}` do backend para obter todos os detalhes atualizados e corretos da solicitação, evitando problemas de sincronia.
- **Design System Centralizado:** O arquivo `App.css` atua como fonte da verdade de estilos do portal, possuindo um escopo global (`:root`) com variáveis CSS nativas que fornecem padronização de tipografia e paleta de cores em toda a plataforma.

---

*Apenas o README foi criado com auxílio de agentes de IA (Copilot e Gemini) e revisado e ajustado manualmente por mim.*
