# FIAP-SAT 1 | Interface de Monitoramento Espacial

Projeto acadêmico de interface web estática para a Global Solution FIAP. A solução representa o painel de monitoramento do `FIAP-SAT 1`, um nanossatélite fictício de observação ambiental em órbita baixa.

O problema escolhido foi a visualização rápida do estado operacional de um sistema espacial. Em um contexto de missão crítica, operadores precisam identificar alertas, checar subsistemas e acompanhar leituras de telemetria sem ruído visual ou excesso de elementos decorativos.

## Objetivo da interface

A interface foi desenhada para apoiar o acompanhamento de:

- saúde térmica do satélite
- energia e carga da bateria
- pressão interna e integridade estrutural
- qualidade de comunicação com a estação em solo
- alertas recentes e histórico resumido de leituras

O público principal da interface são operadores de missão, analistas de telemetria e equipes técnicas que precisam de uma leitura objetiva do sistema.

## Estrutura do projeto

```text
gs-front-web/
├── index.html
├── dashboard.html
├── css/
│   └── style.css
├── js/
│   └── telemetry.js
└── README.md
```

## Páginas

- `index.html`: visão geral da missão, status atual, leituras principais e alertas recentes.
- `dashboard.html`: painel completo com telemetria por subsistema e histórico de leituras.

## Justificativas de UI

### Problema espacial resolvido

O projeto simula uma interface de monitoramento para um satélite educacional que coleta dados orbitais e precisa ser acompanhado a partir do solo. A proposta é mostrar como uma central de monitoramento pode organizar sinais vitais do equipamento de forma clara, rápida e confiável.

### Cores

Foi adotada uma paleta sóbria com cinzas frios, branco e azul técnico:

- `#f3f5f7` e `#ffffff` para fundo e superfícies, permitindo contraste alto e leitura limpa.
- `#1f5f8b` como cor de destaque funcional, associada a tecnologia, precisão e contexto aeroespacial.
- verde, amarelo e vermelho para estados de `ok`, `atenção` e `crítico`, respeitando convenções operacionais.

A intenção foi transmitir seriedade e tecnologia espacial sem recorrer a efeitos exagerados ou estética genérica de ficção científica.

### Tipografia

- fonte sans-serif padrão do sistema para títulos, navegação e textos
- fonte monoespaçada padrão do sistema para horários, leituras numéricas e indicadores técnicos

Essa decisão deixa a interface mais neutra, familiar e direta, reduzindo a sensação de excesso visual e mantendo boa leitura para os dados de telemetria.

### Estrutura e semântica HTML

O projeto utiliza HTML5 semântico com:

- `<header>` para a identidade e navegação principal
- `<nav>` para a troca entre visão geral e telemetria
- `<main>` para o conteúdo principal de cada página
- `<section>` para agrupar blocos temáticos
- `<article>` para cartões e linhas de leitura
- `<aside>` para o resumo operacional da missão
- `<footer>` para metadados finais
- `<time>` para horários e timestamps
- `<table>` com `<caption>`, `<thead>` e `<tbody>` para dados tabulares

Também foram incluídos recursos básicos de acessibilidade:

- link de pulo para o conteúdo principal
- estados de foco visíveis para teclado
- `aria-live` nos indicadores dinâmicos de status
- hierarquia clara de títulos

### Layout e CSS

O CSS foi organizado em um único arquivo compartilhado entre as páginas, com:

- variáveis CSS em `:root` para cores, tipografia e estados
- grid para organização dos cards e subsistemas
- espaçamento consistente e responsivo
- componentes visuais reutilizáveis para botões, badges, cartões e tabelas
- adaptação para telas menores com abordagem mobile-first

O layout prioriza leitura rápida, agrupamento lógico dos dados e navegação direta. A proposta visual é simples, funcional e condizente com um painel de missão crítica.

## Interatividade incluída

Embora o foco da entrega seja a interface estática em HTML e CSS, o projeto inclui uma camada leve de JavaScript para simular uso real:

- atualização periódica de telemetria
- contagem regressiva para o próximo passe orbital
- mudança automática de status operacional
- simulação de evento de tempestade solar
- atualização do histórico de leituras

## Como executar localmente

Na pasta do projeto, rode:

```bash
python3 -m http.server 4173
```

Depois abra:

- `http://127.0.0.1:4173/index.html`
- `http://127.0.0.1:4173/dashboard.html`

## Entrega no GitHub

Para a entrega final, o repositório deve conter:

- `index.html`
- `dashboard.html`
- `css/style.css`
- `README.md`

É recomendável publicar no GitHub Pages para facilitar a avaliação visual.

Links da entrega:

- Repositório: `https://github.com/pedroperrarodev/gs-front-web`
- GitHub Pages: `https://pedroperrarodev.github.io/gs-front-web/`
