# FIAP-SAT 1 — Mission Control Interface

Projeto desenvolvido para a Global Solution 2026 da FIAP, disciplina Front-End Design. A interface simula um painel de controle para monitoramento de telemetria do nanossatélite FIAP-SAT 1, em órbita baixa (LEO) a 550 km de altitude.

O problema que a interface resolve: engenheiros de missão precisam acompanhar os dados de saúde do satélite (temperatura, energia, pressão, comunicações) de forma rápida e clara, especialmente em situações de alerta onde cada segundo importa.

## Páginas

- **index.html** — visão geral da missão: dados básicos do satélite, leituras principais em cards e tabela dos últimos alertas
- **dashboard.html** — painel completo de telemetria dividido por subsistema (térmico, energia, pressão/estrutura, comunicações), com tabela histórica de leituras

## Estrutura de arquivos

```
front-web/
├── index.html
├── dashboard.html
├── css/
│   └── style.css
└── README.md
```

Um único arquivo CSS compartilhado entre as duas páginas.

## Escolhas visuais

**Cores:** fundo escuro (`#0a0e1a`) porque centros de controle de missão real usam ambientes de baixa luminosidade para reduzir fadiga visual durante turnos longos. O ciano (`#00e5ff`) vem da estética de displays aeroespaciais e militares. As cores de status (verde, amarelo, vermelho) seguem o padrão universal de sistemas operacionais: ok, atenção e crítico.

**Tipografia:** dados numéricos usam fonte monospace (Space Mono / Courier New) porque cada caractere tem a mesma largura, evitando "saltos" visuais quando os valores mudam. O restante da interface usa sans-serif (Inter / system-ui) para manter legibilidade em textos corridos.

**Layout:** CSS Grid no painel de telemetria para organizar os 4 subsistemas lado a lado. Flexbox no cabeçalho, nos cards e nos elementos de navegação.

**Semântica:** uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` e `<dl>` conforme as recomendações do HTML5 para acessibilidade e estrutura de conteúdo.

## Como rodar

Sem dependências externas. Basta abrir o `index.html` diretamente no browser.

## Manual de Interatividade (Web Development)

### Em ambas as páginas

- **Leituras ao vivo:** valores de temperatura, tensão, pressão e sinal atualizam automaticamente a cada 3 segundos via `setInterval`.
- **Status dinâmico:** indicador no cabeçalho (`OPERACIONAL` / `1 ALERTA ATIVO` / `CRÍTICO`) muda cor e texto conforme os valores cruzam os limites nominais. Dots verde/amarelo/vermelho refletem o estado de cada sensor individualmente.
- **Contador de próximo passe:** contagem regressiva em tempo real até a janela de comunicação das 16:07 UTC, atualizada via `setInterval` a cada segundo.

### Em `dashboard.html`

- **Botão "Simular Tempestade Solar":** aciona degradação progressiva de pressão, sinal e painel solar B a cada tick. Após alguns ciclos, se qualquer parâmetro atingir nível crítico, um `window.alert` dispara com protocolo de emergência. O botão fica desabilitado durante o evento.
- **Botão "Resetar Sistema":** restaura todos os parâmetros para o estado nominal via `resetSystem()`, reabilita o botão de simulação e re-renderiza o painel imediatamente.
- **Tabela de histórico:** nova linha é inserida no topo da tabela a cada tick de telemetria (3s) com timestamp real, valores atuais e badge de status. Máximo de 15 registros mantidos via `deleteRow`.

### Sequência recomendada para avaliação

1. Abrir `dashboard.html`
2. Observar valores oscilando a cada 3 segundos e contador de próximo passe
3. Clicar em **"Simular Tempestade Solar"** — pressão e sinal começam a degradar, tabela registra cada leitura
4. Aguardar ~10 ciclos (30s) até o `window.alert` de alerta crítico aparecer
5. Clicar em **"Resetar Sistema"** — parâmetros voltam ao nominal, botão reabilita
