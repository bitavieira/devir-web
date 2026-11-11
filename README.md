# Devir Espaço Integrado

Projeto acadêmico de desenvolvimento Front-End para a disciplina de **Programação Front-End da UNIFAN**.

A proposta é reunir um site institucional da Devir Espaço Integrado e um painel de recepção em uma única página, permitindo demonstrar cadastros e agendamentos com HTML, CSS e JavaScript.

> **Status:** em desenvolvimento. As funcionalidades abaixo representam o escopo planejado e serão marcadas conforme forem implementadas e verificadas.

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

## Funcionalidades planejadas

### Site institucional

- [ ] Apresentação da clínica e seção sobre.
- [ ] Cards de especialidades e profissionais.
- [ ] Informações de contato, mapa e acesso ao WhatsApp.
- [ ] Atalho para a recepção na própria página.

### Painel da recepção

- [ ] Cadastro de profissionais com nome, registro e especialidade.
- [ ] Cadastro de pacientes com nome e data de nascimento.
- [ ] Cálculo da idade considerando a data completa de nascimento.
- [ ] Exibição e preenchimento obrigatório do responsável para menores de 18 anos.
- [ ] Registro da opção de nota fiscal, modalidade de atendimento, valor da sessão e observações.
- [ ] Agendamento com paciente, profissional, data e horário.
- [ ] Exibição das consultas em uma tabela dinâmica.
- [ ] Alteração do status entre Agendado e Concluído.
- [ ] Recuperação dos cadastros e agendamentos após recarregar a página.

O PRD utiliza o termo “médicos” e solicita CRM. Como a proposta da clínica também inclui outros profissionais, a nomenclatura e o campo de registro profissional deverão ser alinhados antes da implementação.

## Estrutura planejada

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
| `assets/img/` | Logo e imagens utilizadas no projeto. |
| `README.md` | Documentação e orientações de uso. |
| `.gitignore` | Exclusão de arquivos temporários e configurações locais desnecessárias. |

O acesso à recepção será feito dentro do próprio `index.html`. O MVP não prevê uma página de login ou autenticação.

## Como executar localmente

Estas instruções se aplicam quando os arquivos da aplicação estiverem disponíveis no repositório.

1. Clone o repositório:

   ```bash
   git clone https://github.com/bitavieira/devir-web.git
   ```

2. Abra a pasta `devir-web` no VS Code.
3. Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e selecione **Open with Live Server**.
4. Utilize o endereço local exibido pelo servidor.

Não há etapa de build ou instalação de pacotes do projeto. O carregamento do Bootstrap via CDN e dos recursos externos, como mapa, depende de conexão com a internet.

## Conteúdos de JavaScript

A implementação deverá demonstrar:

| Conteúdo | Aplicação prevista |
| --- | --- |
| `if/else` | Regra de responsável para pacientes menores de idade. |
| `switch/case` | Tratamento da apresentação dos status das consultas. |
| `for` | Percorrer consultas para preencher a tabela. |
| Funções | Organizar cálculo de idade, cadastros e renderização. |
| `getElementById` | Acessar elementos da interface. |
| Eventos | Capturar envio de formulários e alterações nos campos. |
| LocalStorage e JSON | Salvar e recuperar os dados no navegador. |

## Validação da entrega

- [ ] Validar os formulários e as regras de idade.
- [ ] Executar o fluxo completo: cadastrar profissional, cadastrar paciente e agendar consulta.
- [ ] Alterar o status e verificar sua persistência após recarregar.
- [ ] Testar o layout em computador, tablet e smartphone.
- [ ] Conferir imagens, links, navegação e mensagens.
- [ ] Verificar se o fluxo demonstrado apresenta erros no console.
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
- **Site publicado:** publicação pendente.

## Equipe

Integrantes e respectivas contribuições serão registrados durante o desenvolvimento.
