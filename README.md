# Documentação do Projeto List Repository GitHub

## Visão Geral

Aplicação Angular 17 para busca e listagem de repositórios do GitHub com funcionalidades de paginação e interface responsiva.

## Tecnologias Utilizadas

- **Angular 17** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Material** - Componentes de UI (Progress Spinner)
- **RxJS** - Programação reativa
- **Jasmine/Karma** - Framework de testes
- **Phosphor Icons** - Biblioteca de ícones

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── card/           # Componente de exibição de repositório
│   │   ├── header/         # Cabeçalho da aplicação
│   │   ├── paginate/       # Componente de paginação
│   │   └── search/         # Componente de busca
│   ├── model/
│   │   ├── Paginate.model.ts    # Interface de paginação
│   │   └── Repository.model.ts  # Interface de repositório
│   ├── pages/
│   │   ├── home/           # Página inicial
│   │   ├── list-repository/ # Página de listagem
│   │   └── not-found/      # Página 404
│   ├── services/
│   │   └── repositories.service.ts # Serviço de API
│   └── app.routes.ts       # Configuração de rotas
└── assets/
    └── icons/              # Ícones SVG
```

## Funcionalidades

### 1. Busca de Repositórios

- Busca por nome de repositório via API do GitHub
- Validação de entrada obrigatória
- Navegação automática para página de resultados

### 2. Listagem de Repositórios

- Exibição de 5 repositórios por página
- Informações exibidas:
  - Nome do repositório (truncado se necessário)
  - Avatar do proprietário
  - Descrição (truncada se necessário)
  - Linguagem principal
  - Número de estrelas, forks e issues abertas
  - Topics (máximo 4)

### 3. Paginação

- Navegação entre páginas de resultados
- Botões: Primeira, Anterior, Atual, Próxima, Última
- Indicador visual para páginas intermediárias

### 4. Estados de Loading

- Spinner durante carregamento de dados
- Tratamento de estados de erro

## Componentes Principais

### SearchComponent

**Responsabilidade**: Captura e validação de entrada de busca

**Propriedades**:

- `size`: Tamanho do input ('lg' ou 'md')
- `repository`: Termo de busca
- `hasParameter`: Estado de validação

**Métodos**:

- `searchRepository()`: Executa busca e navegação
- `hasParam()`: Valida entrada do usuário

### CardComponent

**Responsabilidade**: Exibição individual de repositório

**Propriedades**:

- `repository`: Dados do repositório (Repository interface)

### PaginateComponent

**Responsabilidade**: Navegação entre páginas

**Propriedades**:

- `paginate`: Array com dados de paginação
- `currentPage`: Página atual

**Métodos**:

- `calcCurrentPage()`: Calcula número da página atual
- `onChangePage()`: Emite evento de mudança de página

### ListRepositoryComponent

**Responsabilidade**: Orquestração da listagem e paginação

**Propriedades**:

- `repositories`: Array de repositórios
- `paginate`: Dados de paginação
- `isLoading`: Estado de carregamento
- `total_repositories`: Total de resultados

**Métodos**:

- `extractData()`: Processa dados da API
- `extractPaginate()`: Extrai informações de paginação
- `manipulateNumbers()`: Formata números (1K, 1M)
- `verifyDescription()`: Trunca descrições longas

## Serviços

### RepositoriesService

**Responsabilidade**: Comunicação com API do GitHub

**Métodos**:

- `getRepositories(repository)`: Busca inicial
- `getRepositoriesByUrl(url)`: Busca por URL específica (paginação)

**Endpoint**: `https://api.github.com/search/repositories`

## Modelos de Dados

### Repository Interface

```typescript
interface Repository {
  name: string;
  avatar: string;
  url: string;
  description: string;
  stars: string;
  open_issues: string;
  forks: string;
  language: string;
  topics: string[];
}
```

### Paginate Interface

```typescript
interface Paginate {
  prev?: string;
  next?: string;
  last?: string;
  first?: string;
  prev_number?: string;
  next_number?: string;
  last_number?: string;
  first_number?: string;
}
```

## Roteamento

- `/` - Página inicial (HomeComponent)
- `/list/:repository` - Listagem de repositórios (ListRepositoryComponent)
- `/**` - Página não encontrada (NotFoundComponent)

## Formatação de Dados

### Números

- > = 1.000.000: Formato "1M"
- > = 1.000: Formato "1K"
- < 1.000: Número original

### Strings

- Nome do repositório: Truncado em 25 caracteres
- Descrição: Truncada em 72 caracteres
- Topics: Limitado a 4 itens

## Tratamento de Erros

- Erros de API são logados no console
- Estados de loading são gerenciados adequadamente
- Validação de entrada obrigatória na busca

## Testes

### Cobertura de Testes

- **Componentes**: Testes unitários e de integração completos
- **Serviços**: Testes com HttpClientTestingModule
- **Interações**: Testes de eventos e navegação
- **Edge Cases**: Validação de cenários limite

### Tipos de Teste

- Testes unitários para lógica de negócio
- Testes de integração para renderização
- Testes de interação do usuário
- Mocks para dependências externas

## Configuração

### Dependências Principais

```json
{
  "@angular/animations": "^17.3.0",
  "@angular/cdk": "^17.3.10",
  "@angular/common": "^17.3.0",
  "@angular/compiler": "^17.3.0",
  "@angular/core": "^17.3.0",
  "@angular/forms": "^17.3.0",
  "@angular/material": "^17.3.10",
  "@angular/platform-browser": "^17.3.0",
  "@angular/platform-browser-dynamic": "^17.3.0",
  "@angular/router": "^17.3.0",
  "phosphor-icons": "^1.4.2",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0",
  "zone.js": "~0.14.3"
}
```

### Dependências de Desenvolvimento

```json
{
  "@angular-devkit/build-angular": "^17.3.17",
  "@angular/cli": "^17.3.17",
  "@angular/compiler-cli": "^17.3.0",
  "@types/jasmine": "~5.1.0",
  "jasmine-core": "~5.1.0",
  "karma": "~6.4.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "karma-jasmine": "~5.1.0",
  "karma-jasmine-html-reporter": "~2.1.0",
  "typescript": "~5.4.2"
}
```

### Configuração de Estilos

- CSS Variables para tema consistente
- Font: Inter (Google Fonts)
- Design responsivo com classes condicionais

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI

### Passos para instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd list-repository-github
```

2. Instale as dependências:

```bash
npm install
```

3. Execute a aplicação:

```bash
ng serve
```

4. Acesse no navegador:

```
http://localhost:4200
```

### Executar testes

```bash
# Testes unitários
ng test

# Testes com coverage
ng test --code-coverage
```

### Build para produção

```bash
ng build --configuration production
```

## API Utilizada

**GitHub Search API**

- Endpoint: `https://api.github.com/search/repositories`
- Parâmetros: `q` (query), `per_page` (5), `page` (paginação)
- Rate limit: 60 requests por hora (sem autenticação)

## Estrutura de Arquivos de Teste

```
src/app/
├── components/
│   ├── card/card.component.spec.ts
│   ├── header/header.component.spec.ts
│   ├── paginate/paginate.component.spec.ts
│   └── search/search.component.spec.ts
├── pages/
│   ├── home/home.component.spec.ts
│   ├── list-repository/list-repository.component.spec.ts
│   └── not-found/not-found.component.spec.ts
├── services/
│   └── repositories.service.spec.ts
└── app.component.spec.ts
```

## Considerações Técnicas

### Performance

- Standalone components para otimização de bundle

### Acessibilidade

- Alt texts em imagens
- Estrutura semântica HTML
- Navegação por teclado (Enter na busca)

### Responsividade

- Componente de busca com tamanhos adaptativos
- Layout flexível para diferentes telas
- CSS Grid/Flexbox para organização
