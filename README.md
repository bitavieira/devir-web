# Devir Espaço Integrado

Projeto acadêmico de desenvolvimento Front-End para a disciplina de **Programação Front-End da UNIFAN**.

A proposta é reunir um site institucional da Devir Espaço Integrado e um painel de recepção em uma única página, permitindo demonstrar cadastros e agendamentos com HTML, CSS e JavaScript.

> **Status:** MVP concluído. Todas as funcionalidades abaixo foram implementadas e testadas.

## Objetivo

Desenvolver uma interface responsiva e funcional, aplicando os conteúdos estudados na disciplina e mantendo uma estrutura simples, que facilite a compreensão e a explicação do código.

**Data de entrega:** 12/11/2026.

## Tecnologias previstas

- **HTML5:** estrutura e conteúdo das páginas.
- **CSS3:** identidade visual, organização do layout e responsividade.
- **Bootstrap 5.3 via CDN:** componentes e grid responsivo.
- **JavaScript:** validações, eventos e manipulação do DOM.
- **LocalStorage:** persistência dos dados no navegador.
- **Git e GitHub:** versionamento e armazenamento do código.
- **Figma:** referência de interface.

## Funcionalidades

### Site institucional

- [x] Apresentação da clínica e seção sobre.
- [x] Cards de especialidades e profissionais (os cards de profissionais são gerados a partir dos cadastros da recepção).
- [x] Informações de contato, mapa e acesso ao WhatsApp.
- [x] Atalho para a recepção na própria página (botão **Área do funcionário**).

### Painel da recepção

- [x] Login de demonstração (usuário `recepcao`, senha `devir123`).
- [x] Recepção organizada em abas: **Agenda**, **Consultas**, **Pacientes** e **Profissionais**.
- [x] Agenda multidisciplinar com duas visões:
  - **Dia:** grade com horários (07:00–19:00, de 30 em 30 minutos) por profissional e agendamento com um clique no horário livre.
  - **Mês:** calendário com as consultas de cada dia; clicar em um dia abre a visão do dia.
  - Navegação entre dias ou meses e filtro por especialidade.
- [x] Cadastro de profissionais com nome, registro e especialidade.
- [x] Cadastro de pacientes com nome e data de nascimento, com busca por nome.
- [x] Cálculo da idade considerando a data completa de nascimento.
- [x] Exibição e preenchimento obrigatório do responsável para menores de 18 anos.
- [x] Registro da opção de nota fiscal, modalidade de atendimento, valor da sessão e observações.
- [x] Agendamento com paciente, profissional, data e horário (bloqueia datas e horários passados, horário fora do expediente ou fora da grade de 30 minutos e conflitos de horário).
- [x] Exibição das consultas em uma tabela dinâmica, com filtro por status.
- [x] Alteração do status entre Agendado e Concluído.
- [x] Recuperação dos cadastros e agendamentos após recarregar a página.

O PRD utiliza o termo “médicos” e solicita CRM. Como a clínica também reúne outras áreas, o sistema usa **profissionais** e um campo de **registro profissional** (CRP, CRM, CRFa etc.).

No primeiro acesso, o sistema cria três profissionais fictícios para que o site não fique vazio. Eles podem ser excluídos na recepção.

## Estrutura

```text
devir-web/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── img/
├── README.md
└── .gitignore
```

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `index.html` | Site público e seção da recepção, com formulários e tabela. |
| `css/style.css` | Variáveis de cores, estilos próprios e media queries. |
| `js/script.js` | Eventos, validações, cadastros, agendamentos e persistência. |
| `assets/img/` | Logo original (`logo.png`, usada como ícone da aba) e versão recortada para o topo (`logo-topo.png`). |
| `README.md` | Documentação e orientações de uso. |
| `.gitignore` | Exclusão de arquivos temporários e configurações locais desnecessárias. |

O acesso à recepção é feito dentro do próprio `index.html`. O login é apenas uma demonstração no navegador (não há servidor nem segurança real).

## Como executar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/bitavieira/devir-web.git
   ```

2. Abra a pasta `devir-web` no VS Code.
3. Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e selecione **Open with Live Server**.
4. Utilize o endereço local exibido pelo servidor.

Não há etapa de build ou instalação de pacotes do projeto. O carregamento do Bootstrap via CDN e dos recursos externos, como mapa, depende de conexão com a internet.

## Conteúdos de JavaScript

Onde cada conteúdo aparece no `js/script.js`:

| Conteúdo | Aplicação prevista |
| --- | --- |
| `if/else` | `verificarIdade()` e `cadastrarPaciente()`: regra do responsável para menores de 18 anos. |
| `switch/case` | `aparenciaStatus()`: cor do status e texto do botão. |
| `for` | `renderizarTabela()` e `renderizarAgendaDia()`: percorrem consultas, horários e profissionais para montar a tabela e a grade. |
| Funções | `calcularIdade()`, `cadastrarProfissional()`, `agendarConsulta()`, `renderizarTabela()`... |
| `getElementById` | Usado em todo o arquivo para acessar campos, listas e a tabela. |
| Eventos | `submit` dos formulários, `change` na data de nascimento e no filtro, `click` nos botões. |
| LocalStorage e JSON | `salvarLista()` (`JSON.stringify`) e `carregarLista()` (`JSON.parse`). |

## Roteiro da apresentação

1. Mostrar o site: Sobre nós, Especialidades, Profissionais, Fale Conosco (mapa e WhatsApp) e o menu no celular.
2. Clicar em **Área do funcionário**, errar a senha (mensagem de erro) e entrar com `recepcao` / `devir123`.
3. Na aba **Profissionais**, cadastrar um profissional e clicar em **Ver site** para mostrar o novo card.
4. Na aba **Pacientes**, cadastrar um paciente **menor de idade**: o campo do responsável aparece e é obrigatório.
5. Cadastrar um paciente adulto com nota fiscal e observações e mostrar a busca por nome.
6. Na aba **Agenda** (visão **Dia**), clicar num horário livre: a aba **Consultas** abre com profissional, data e horário preenchidos.
7. Agendar e tentar repetir o mesmo horário para o mesmo profissional (o sistema bloqueia).
8. Voltar à agenda, trocar para a visão **Mês**, clicar no dia da consulta, concluí-la, **recarregar a página** e mostrar que tudo continua salvo.
9. Abrir o `script.js` e mostrar os trechos da tabela acima.

## Validação da entrega

- [x] Validar os formulários e as regras de idade.
- [x] Executar o fluxo completo: cadastrar profissional, cadastrar paciente e agendar consulta.
- [x] Alterar o status e verificar sua persistência após recarregar.
- [x] Testar o layout em computador, tablet e smartphone.
- [x] Conferir imagens, links, navegação e mensagens.
- [x] Verificar se o fluxo demonstrado apresenta erros no console.
- [ ] Publicar a aplicação e testar o endereço público.
- [ ] Preparar slides com telas, trechos de código e explicação das funcionalidades.

## Organização do desenvolvimento

As tarefas serão acompanhadas em um **GitHub Project**, com as colunas:

- **A fazer:** tarefas ainda não iniciadas.
- **Em andamento:** tarefa em execução.
- **Concluído:** tarefas implementadas e verificadas.

Os commits serão organizados por entregas pequenas e relacionadas às funcionalidades.

O repositório anterior, [tde-clinica](https://github.com/bitavieira/tde-clinica), será preservado como referência. Este repositório terá histórico próprio.

## Limitações do MVP

Esta é uma demonstração acadêmica e deve utilizar dados fictícios.

Os dados serão armazenados apenas no navegador e na origem em que a aplicação for utilizada. Não haverá backend, autenticação ou sincronização entre computadores. A limpeza dos dados do navegador pode apagar os registros.

A opção de nota fiscal apenas registra a preferência no cadastro; não realiza emissão fiscal. O agendamento representa um registro local de demonstração.

## Referências e links

- [Repositório](https://github.com/bitavieira/devir-web)
- [Protótipo no Figma — Serenamente](https://www.figma.com/design/fSQtdVYwjV69m6lyTW7KoT/Serenamente--Copy-)
- [PRD do projeto](https://drive.google.com/file/d/1omyIDK0qxME6ZHp3aVVPWl7JpHl7g0U6/view)
- **GitHub Project:** vínculo pendente.
- **Site publicado:** (https://devir-web.vercel.app/)

## Equipe

Integrantes e respectivas contribuições serão registrados durante o desenvolvimento.
