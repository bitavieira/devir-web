/* =========================================================
   DEVIR ESPAÇO INTEGRADO — script.js

   GUIA DO ARQUIVO
   1. Dados e LocalStorage
   2. Funções auxiliares (datas, idade, mensagens)
   3. Navegação entre site, login e recepção
   4. Login
   5. Profissionais
   6. Pacientes
   7. Agendamentos e tabela de consultas
   8. Agenda multidisciplinar (visão do dia e do mês)
   9. Abas da recepção
   10. Inicialização
   ========================================================= */


/* ---------------------------------------------------------
   1. DADOS E LOCALSTORAGE
   Cada lista é salva no navegador como texto JSON.
   --------------------------------------------------------- */

const CHAVE_PROFISSIONAIS = "devir_profissionais";
const CHAVE_PACIENTES = "devir_pacientes";
const CHAVE_CONSULTAS = "devir_consultas";
const CHAVE_LOGIN = "devir_logado";

// Expediente da clínica (agenda em intervalos de 30 minutos)
const HORA_INICIO = "07:00";
const HORA_FIM = "19:00";

// Usuário de demonstração (o MVP não tem servidor)
const USUARIO_DEMO = "recepcao";
const SENHA_DEMO = "devir123";

let profissionais = [];
let pacientes = [];
let consultas = [];

// Lê uma lista do LocalStorage. Se não existir, devolve null.
function carregarLista(chave) {
    try {
        const texto = localStorage.getItem(chave);

        if (texto === null) {
            return null;
        }

        return JSON.parse(texto);
    } catch (erro) {
        return [];
    }
}

// Salva uma lista no LocalStorage como JSON.
function salvarLista(chave, lista) {
    try {
        localStorage.setItem(chave, JSON.stringify(lista));
    } catch (erro) {
        mostrarMensagem("Não foi possível salvar no navegador.", "danger");
    }
}

function salvarTudo() {
    salvarLista(CHAVE_PROFISSIONAIS, profissionais);
    salvarLista(CHAVE_PACIENTES, pacientes);
    salvarLista(CHAVE_CONSULTAS, consultas);
}

// Carrega os dados salvos. No primeiro acesso, cria profissionais
// fictícios para que o site público não fique vazio.
function carregarDados() {
    const profissionaisSalvos = carregarLista(CHAVE_PROFISSIONAIS);

    if (profissionaisSalvos === null) {
        profissionais = [
            { id: "p1", nome: "Ana Beatriz Lima", especialidade: "Psicologia", registro: "CRP 03/00001" },
            { id: "p2", nome: "Carlos Eduardo Souza", especialidade: "Psicopedagogia", registro: "ABPp 0001" },
            { id: "p3", nome: "Juliana Santos Rocha", especialidade: "Fonoaudiologia", registro: "CRFa 4-00001" }
        ];
        salvarLista(CHAVE_PROFISSIONAIS, profissionais);
    } else {
        profissionais = profissionaisSalvos;
    }

    pacientes = carregarLista(CHAVE_PACIENTES) || [];
    consultas = carregarLista(CHAVE_CONSULTAS) || [];
}

// Gera um identificador simples e único
function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}


/* ---------------------------------------------------------
   2. FUNÇÕES AUXILIARES
   --------------------------------------------------------- */

// Evita que textos digitados sejam interpretados como HTML
function escaparTexto(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// "2026-11-12" -> "12/11/2026"
function formatarData(dataISO) {
    const partes = dataISO.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Data de hoje no formato "aaaa-mm-dd", no fuso do navegador
function dataDeHoje() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return hoje.getFullYear() + "-" + mes + "-" + dia;
}

// Hora atual no formato "hh:mm"
function horaAgora() {
    const agora = new Date();
    return String(agora.getHours()).padStart(2, "0") + ":" + String(agora.getMinutes()).padStart(2, "0");
}

// Soma dias a uma data "aaaa-mm-dd"
function somarDias(dataISO, dias) {
    const data = new Date(dataISO + "T12:00:00");
    data.setDate(data.getDate() + dias);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return data.getFullYear() + "-" + mes + "-" + dia;
}

// "2026-11-12" -> "quinta-feira, 12 de novembro de 2026"
function dataPorExtenso(dataISO) {
    const data = new Date(dataISO + "T12:00:00");
    return data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatarValor(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Calcula a idade considerando dia, mês e ano de nascimento.
function calcularIdade(dataNascimento) {
    const partes = dataNascimento.split("-");
    const anoNasc = Number(partes[0]);
    const mesNasc = Number(partes[1]);
    const diaNasc = Number(partes[2]);

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    const diaAtual = hoje.getDate();

    let idade = anoAtual - anoNasc;

    // Se o aniversário deste ano ainda não chegou, diminui 1
    if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
        idade = idade - 1;
    }

    return idade;
}

// Mostra uma mensagem no topo do painel por alguns segundos
let temporizadorMensagem;

function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = texto;
    mensagem.className = "alert alert-" + tipo;
    mensagem.hidden = false;

    clearTimeout(temporizadorMensagem);
    temporizadorMensagem = setTimeout(function () {
        mensagem.hidden = true;
    }, 4000);
}

// Janela de confirmação do próprio site (substitui o confirm do navegador)
let acaoConfirmada = null;

function confirmarAcao(texto, acao) {
    const janela = document.getElementById("janela-confirmacao");

    if (!window.bootstrap) {
        acao();
        return;
    }

    document.getElementById("texto-confirmacao").textContent = texto;
    acaoConfirmada = acao;
    bootstrap.Modal.getOrCreateInstance(janela).show();
}

// Marca ou desmarca um campo como inválido (estilo do Bootstrap)
function marcarCampo(campo, valido) {
    if (valido) {
        campo.classList.remove("is-invalid");
    } else {
        campo.classList.add("is-invalid");
    }
    return valido;
}

function limparValidacao(formulario) {
    const campos = formulario.querySelectorAll(".is-invalid");
    for (let i = 0; i < campos.length; i++) {
        campos[i].classList.remove("is-invalid");
    }
}


/* ---------------------------------------------------------
   3. NAVEGAÇÃO ENTRE SITE, LOGIN E RECEPÇÃO
   Tudo fica no mesmo index.html; só mostramos ou escondemos.
   --------------------------------------------------------- */

// sessionStorage guarda o login só enquanto a aba estiver aberta
function lerSessao(chave) {
    try {
        return sessionStorage.getItem(chave);
    } catch (erro) {
        return null;
    }
}

function gravarSessao(chave, valor) {
    try {
        if (valor === null) {
            sessionStorage.removeItem(chave);
        } else {
            sessionStorage.setItem(chave, valor);
        }
    } catch (erro) {
        // Sem sessionStorage o sistema funciona, só não lembra a tela
    }
}

function estaLogado() {
    return lerSessao(CHAVE_LOGIN) === "sim";
}

function mostrarTela(tela) {
    document.getElementById("site-publico").hidden = (tela !== "site");
    document.getElementById("login").hidden = (tela !== "login");
    document.getElementById("recepcao").hidden = (tela !== "recepcao");

    // Lembra a tela atual para continuar nela após recarregar a página
    gravarSessao("devir_tela", tela);
    window.scrollTo(0, 0);

    if (tela === "login") {
        document.getElementById("usuario-login").focus();
    } else if (tela === "recepcao") {
        document.getElementById("titulo-recepcao").focus();
    }
}

// Fecha o menu do celular depois de clicar em um link
function fecharMenu() {
    const menu = document.getElementById("menuPrincipal");

    if (menu.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
}

function configurarNavegacao() {
    // Botão "Área do funcionário"
    document.getElementById("botao-area-funcionario").addEventListener("click", function (evento) {
        evento.preventDefault();
        fecharMenu();

        if (estaLogado()) {
            mostrarTela("recepcao");
        } else {
            mostrarTela("login");
        }
    });

    // Links do menu e da logo levam de volta ao site público
    const links = document.querySelectorAll("#menuPrincipal .nav-link, .navbar-brand, #site-publico a[href^='#']");

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            fecharMenu();

            if (document.getElementById("site-publico").hidden) {
                mostrarTela("site");
                // Espera a seção aparecer para rolar até ela
                const destino = document.querySelector(this.getAttribute("href"));
                if (destino) {
                    setTimeout(function () { destino.scrollIntoView(); }, 0);
                }
            }
        });
    }

    document.getElementById("voltar-site").addEventListener("click", function () {
        mostrarTela("site");
    });

    document.getElementById("ver-site").addEventListener("click", function () {
        mostrarTela("site");
    });

    document.getElementById("sair-recepcao").addEventListener("click", function () {
        gravarSessao(CHAVE_LOGIN, null);
        mostrarTela("site");
    });
}


/* ---------------------------------------------------------
   4. LOGIN
   --------------------------------------------------------- */

function configurarLogin() {
    const formulario = document.getElementById("form-login");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const usuario = document.getElementById("usuario-login").value.trim();
        const senha = document.getElementById("senha-login").value;
        const erro = document.getElementById("erro-login");

        if (usuario === USUARIO_DEMO && senha === SENHA_DEMO) {
            gravarSessao(CHAVE_LOGIN, "sim");
            erro.hidden = true;
            formulario.reset();
            mostrarTela("recepcao");
        } else {
            erro.hidden = false;
            document.getElementById("senha-login").value = "";
        }
    });
}


/* ---------------------------------------------------------
   5. PROFISSIONAIS
   --------------------------------------------------------- */

function buscarProfissional(id) {
    for (let i = 0; i < profissionais.length; i++) {
        if (profissionais[i].id === id) {
            return profissionais[i];
        }
    }
    return null;
}

function cadastrarProfissional(evento) {
    evento.preventDefault();

    const campoNome = document.getElementById("nome-profissional");
    const campoEspecialidade = document.getElementById("especialidade-profissional");
    const campoRegistro = document.getElementById("registro-profissional");

    const nome = campoNome.value.trim();
    const especialidade = campoEspecialidade.value;
    const registro = campoRegistro.value.trim();

    // Valida todos os campos de uma vez para mostrar todos os erros
    let valido = marcarCampo(campoNome, nome.length >= 3);
    valido = marcarCampo(campoEspecialidade, especialidade !== "") && valido;
    valido = marcarCampo(campoRegistro, registro !== "") && valido;

    if (!valido) {
        mostrarMensagem("Confira os campos destacados do profissional.", "danger");
        return;
    }

    profissionais.push({
        id: gerarId(),
        nome: nome,
        especialidade: especialidade,
        registro: registro
    });

    salvarTudo();
    evento.target.reset();
    limparValidacao(evento.target);
    atualizarTudo();
    mostrarMensagem("Profissional " + nome + " cadastrado com sucesso.", "success");
}

function excluirProfissional(id) {
    // Não deixa excluir quem tem consulta agendada
    for (let i = 0; i < consultas.length; i++) {
        if (consultas[i].profissionalId === id && consultas[i].status === "Agendado") {
            mostrarMensagem("Este profissional tem consultas agendadas. Conclua ou exclua as consultas antes.", "warning");
            return;
        }
    }

    const profissional = buscarProfissional(id);

    confirmarAcao("Excluir o profissional " + profissional.nome + "?", function () {
        profissionais = profissionais.filter(function (item) {
            return item.id !== id;
        });

        salvarTudo();
        atualizarTudo();
        mostrarMensagem("Profissional excluído.", "success");
    });
}

// Lista na recepção
function renderizarListaProfissionais() {
    const lista = document.getElementById("lista-profissionais");
    let html = "";

    if (profissionais.length === 0) {
        html = '<li class="list-group-item text-body-secondary">Nenhum profissional cadastrado.</li>';
    }

    for (let i = 0; i < profissionais.length; i++) {
        const p = profissionais[i];
        html +=
            '<li class="list-group-item d-flex justify-content-between align-items-center gap-2">' +
            "<span><strong>" + escaparTexto(p.nome) + "</strong><br>" +
            '<small class="text-body-secondary">' + escaparTexto(p.especialidade) +
            " · " + escaparTexto(p.registro) + "</small></span>" +
            '<button type="button" class="btn btn-sm btn-outline-danger" data-excluir-profissional="' + p.id + '">Excluir</button>' +
            "</li>";
    }

    lista.innerHTML = html;
}

// "Ana Beatriz Lima" -> "AL"
function obterIniciais(nome) {
    const partes = nome.trim().split(" ");
    let iniciais = partes[0].charAt(0);

    if (partes.length > 1) {
        iniciais += partes[partes.length - 1].charAt(0);
    }

    return escaparTexto(iniciais.toUpperCase());
}

// Cards do site público ("Pessoas que cuidam de pessoas")
function renderizarCardsProfissionais() {
    const container = document.getElementById("cards-profissionais");
    let html = "";

    for (let i = 0; i < profissionais.length; i++) {
        const p = profissionais[i];
        html +=
            '<div class="col">' +
            '<article class="card h-100">' +
            '<div class="avatar-area"><span class="avatar" aria-hidden="true">' + obterIniciais(p.nome) + "</span></div>" +
            '<div class="card-body">' +
            '<h3 class="card-title h5">' + escaparTexto(p.nome) + "</h3>" +
            '<p class="card-text mb-2"><span class="especialidade-tag">' + escaparTexto(p.especialidade) + "</span></p>" +
            '<p class="card-text text-body-secondary mb-0">' + escaparTexto(p.registro) + "</p>" +
            "</div></article></div>";
    }

    container.innerHTML = html;
    document.getElementById("sem-profissionais").hidden = profissionais.length > 0;
}


/* ---------------------------------------------------------
   6. PACIENTES
   --------------------------------------------------------- */

function buscarPaciente(id) {
    for (let i = 0; i < pacientes.length; i++) {
        if (pacientes[i].id === id) {
            return pacientes[i];
        }
    }
    return null;
}

// Mostra a idade e o campo de responsável ao escolher a data
function verificarIdade() {
    const nascimento = document.getElementById("nascimento-paciente").value;
    const textoIdade = document.getElementById("idade-paciente");
    const grupoResponsavel = document.getElementById("grupo-responsavel");
    const campoResponsavel = document.getElementById("responsavel-paciente");

    if (nascimento === "" || nascimento > dataDeHoje()) {
        textoIdade.hidden = true;
        grupoResponsavel.hidden = true;
        campoResponsavel.required = false;
        return;
    }

    const idade = calcularIdade(nascimento);
    textoIdade.hidden = false;

    if (idade < 18) {
        textoIdade.innerHTML = "Idade: <strong>" + idade + " ano(s)</strong> — menor de idade, informe o responsável.";
        grupoResponsavel.hidden = false;
        campoResponsavel.required = true;
    } else {
        textoIdade.innerHTML = "Idade: <strong>" + idade + " anos</strong>.";
        grupoResponsavel.hidden = true;
        campoResponsavel.required = false;
        campoResponsavel.value = "";
        campoResponsavel.classList.remove("is-invalid");
    }
}

function cadastrarPaciente(evento) {
    evento.preventDefault();

    const campoNome = document.getElementById("nome-paciente");
    const campoNascimento = document.getElementById("nascimento-paciente");
    const campoResponsavel = document.getElementById("responsavel-paciente");
    const campoModalidade = document.getElementById("modalidade-paciente");
    const campoValor = document.getElementById("valor-paciente");
    const erroNascimento = document.getElementById("erro-nascimento");

    const nome = campoNome.value.trim();
    const nascimento = campoNascimento.value;
    const responsavel = campoResponsavel.value.trim();
    const modalidade = campoModalidade.value;
    const valor = Number(campoValor.value);

    let valido = marcarCampo(campoNome, nome.length >= 3);

    // Data de nascimento: obrigatória, não pode ser futura nem absurda
    let nascimentoValido = true;
    if (nascimento === "") {
        erroNascimento.textContent = "Informe a data de nascimento.";
        nascimentoValido = false;
    } else if (nascimento > dataDeHoje()) {
        erroNascimento.textContent = "A data não pode estar no futuro.";
        nascimentoValido = false;
    } else if (calcularIdade(nascimento) > 120) {
        erroNascimento.textContent = "Confira o ano de nascimento.";
        nascimentoValido = false;
    }
    valido = marcarCampo(campoNascimento, nascimentoValido) && valido;

    // Regra principal: menor de 18 anos precisa de responsável
    let idade = null;
    if (nascimentoValido) {
        idade = calcularIdade(nascimento);

        if (idade < 18) {
            valido = marcarCampo(campoResponsavel, responsavel.length >= 3) && valido;
        } else {
            marcarCampo(campoResponsavel, true);
        }
    }

    valido = marcarCampo(campoModalidade, modalidade !== "") && valido;
    valido = marcarCampo(campoValor, campoValor.value !== "" && valor > 0) && valido;

    if (!valido) {
        mostrarMensagem("Confira os campos destacados do paciente.", "danger");
        return;
    }

    pacientes.push({
        id: gerarId(),
        nome: nome,
        nascimento: nascimento,
        responsavel: idade < 18 ? responsavel : "",
        notaFiscal: document.getElementById("nota-paciente").checked,
        modalidade: modalidade,
        valor: valor,
        observacoes: document.getElementById("observacoes-paciente").value.trim()
    });

    salvarTudo();
    evento.target.reset();
    limparValidacao(evento.target);
    verificarIdade();
    atualizarTudo();
    mostrarMensagem("Paciente " + nome + " cadastrado com sucesso.", "success");
}

function excluirPaciente(id) {
    for (let i = 0; i < consultas.length; i++) {
        if (consultas[i].pacienteId === id && consultas[i].status === "Agendado") {
            mostrarMensagem("Este paciente tem consultas agendadas. Conclua ou exclua as consultas antes.", "warning");
            return;
        }
    }

    const paciente = buscarPaciente(id);

    confirmarAcao("Excluir o paciente " + paciente.nome + "?", function () {
        pacientes = pacientes.filter(function (item) {
            return item.id !== id;
        });

        salvarTudo();
        atualizarTudo();
        mostrarMensagem("Paciente excluído.", "success");
    });
}

function renderizarListaPacientes() {
    const lista = document.getElementById("lista-pacientes");
    const busca = document.getElementById("busca-paciente").value.trim().toLowerCase();
    let html = "";
    let encontrados = 0;

    for (let i = 0; i < pacientes.length; i++) {
        const p = pacientes[i];

        // Busca pelo nome (ignora maiúsculas e minúsculas)
        if (busca !== "" && p.nome.toLowerCase().indexOf(busca) === -1) {
            continue;
        }
        encontrados++;
        const idade = calcularIdade(p.nascimento);

        let detalhes = idade + " anos · " + p.modalidade + " · " + formatarValor(p.valor);

        if (p.notaFiscal) {
            detalhes += " · com nota fiscal";
        }
        if (p.responsavel !== "") {
            detalhes += "<br>Responsável: " + escaparTexto(p.responsavel);
        }
        if (p.observacoes !== "") {
            detalhes += "<br>Obs.: " + escaparTexto(p.observacoes);
        }

        html +=
            '<li class="list-group-item d-flex justify-content-between align-items-center gap-2">' +
            "<span><strong>" + escaparTexto(p.nome) + "</strong><br>" +
            '<small class="text-body-secondary">' + detalhes + "</small></span>" +
            '<button type="button" class="btn btn-sm btn-outline-danger" data-excluir-paciente="' + p.id + '">Excluir</button>' +
            "</li>";
    }

    if (pacientes.length === 0) {
        html = '<li class="list-group-item text-body-secondary">Nenhum paciente cadastrado.</li>';
    } else if (encontrados === 0) {
        html = '<li class="list-group-item text-body-secondary">Nenhum paciente encontrado.</li>';
    }

    lista.innerHTML = html;
}


/* ---------------------------------------------------------
   7. AGENDAMENTOS E TABELA DE CONSULTAS
   --------------------------------------------------------- */

// Preenche os selects do agendamento com os cadastros atuais
function preencherSelects() {
    const selectPaciente = document.getElementById("agenda-paciente");
    const selectProfissional = document.getElementById("agenda-profissional");

    let opcoesPacientes = '<option value="">Selecione</option>';
    for (let i = 0; i < pacientes.length; i++) {
        opcoesPacientes += '<option value="' + pacientes[i].id + '">' + escaparTexto(pacientes[i].nome) + "</option>";
    }

    let opcoesProfissionais = '<option value="">Selecione</option>';
    for (let i = 0; i < profissionais.length; i++) {
        opcoesProfissionais += '<option value="' + profissionais[i].id + '">' +
            escaparTexto(profissionais[i].nome) + " (" + escaparTexto(profissionais[i].especialidade) + ")</option>";
    }

    selectPaciente.innerHTML = opcoesPacientes;
    selectProfissional.innerHTML = opcoesProfissionais;
}

function agendarConsulta(evento) {
    evento.preventDefault();

    const campoPaciente = document.getElementById("agenda-paciente");
    const campoProfissional = document.getElementById("agenda-profissional");
    const campoData = document.getElementById("agenda-data");
    const campoHorario = document.getElementById("agenda-horario");
    const erroData = document.getElementById("erro-agenda-data");
    const erroHorario = document.getElementById("erro-agenda-horario");

    const pacienteId = campoPaciente.value;
    const profissionalId = campoProfissional.value;
    const data = campoData.value;
    const horario = campoHorario.value;

    let valido = marcarCampo(campoPaciente, pacienteId !== "");
    valido = marcarCampo(campoProfissional, profissionalId !== "") && valido;

    // Data: obrigatória e não pode ser no passado
    let dataValida = true;
    if (data === "") {
        erroData.textContent = "Informe a data.";
        dataValida = false;
    } else if (data < dataDeHoje()) {
        erroData.textContent = "Escolha uma data a partir de hoje.";
        dataValida = false;
    }
    valido = marcarCampo(campoData, dataValida) && valido;

    // Horário: dentro do expediente
    let horarioValido = true;
    if (horario === "") {
        erroHorario.textContent = "Informe o horário.";
        horarioValido = false;
    } else if (horario < HORA_INICIO || horario > HORA_FIM) {
        erroHorario.textContent = "Atendimento das " + HORA_INICIO + " às " + HORA_FIM + ".";
        horarioValido = false;
    } else if (horario.slice(3) !== "00" && horario.slice(3) !== "30") {
        erroHorario.textContent = "Use horários cheios ou meia hora (ex.: 09:00 ou 09:30).";
        horarioValido = false;
    } else if (data === dataDeHoje() && horario < horaAgora()) {
        erroHorario.textContent = "Esse horário de hoje já passou.";
        horarioValido = false;
    }
    valido = marcarCampo(campoHorario, horarioValido) && valido;

    if (!valido) {
        mostrarMensagem("Confira os campos destacados do agendamento.", "danger");
        return;
    }

    // Evita dois atendimentos no mesmo horário
    for (let i = 0; i < consultas.length; i++) {
        const c = consultas[i];

        if (c.data === data && c.horario === horario) {
            if (c.profissionalId === profissionalId) {
                mostrarMensagem("Este profissional já tem consulta nesse dia e horário.", "warning");
                return;
            }
            if (c.pacienteId === pacienteId) {
                mostrarMensagem("Este paciente já tem consulta nesse dia e horário.", "warning");
                return;
            }
        }
    }

    consultas.push({
        id: gerarId(),
        pacienteId: pacienteId,
        profissionalId: profissionalId,
        data: data,
        horario: horario,
        status: "Agendado"
    });

    salvarTudo();
    evento.target.reset();
    limparValidacao(evento.target);
    atualizarTudo();
    // A agenda do dia passa a mostrar o dia da nova consulta
    document.getElementById("agenda-dia").value = data;
    atualizarTudo();
    mostrarMensagem("Consulta agendada para " + formatarData(data) + " às " + horario + ".", "success");
}

// Alterna o status entre Agendado e Concluído
function alternarStatus(id) {
    for (let i = 0; i < consultas.length; i++) {
        if (consultas[i].id === id) {
            if (consultas[i].status === "Agendado") {
                consultas[i].status = "Concluído";
            } else {
                consultas[i].status = "Agendado";
            }
        }
    }

    salvarTudo();
    atualizarTudo();
}

function excluirConsulta(id) {
    confirmarAcao("Excluir esta consulta?", function () {
        consultas = consultas.filter(function (item) {
            return item.id !== id;
        });

        salvarTudo();
        atualizarTudo();
        mostrarMensagem("Consulta excluída.", "success");
    });
}

// switch/case: define a aparência de cada status
function aparenciaStatus(status) {
    let classe;
    let textoBotao;

    switch (status) {
        case "Agendado":
            classe = "text-bg-warning";
            textoBotao = "Concluir";
            break;
        case "Concluído":
            classe = "text-bg-success";
            textoBotao = "Reabrir";
            break;
        default:
            classe = "text-bg-secondary";
            textoBotao = "Alterar";
    }

    return { classe: classe, textoBotao: textoBotao };
}

// for: percorre as consultas e monta as linhas da tabela
function renderizarTabela() {
    const corpo = document.getElementById("tabela-consultas");
    const filtro = document.getElementById("filtro-status").value;

    // Ordena por data e horário
    const ordenadas = consultas.slice().sort(function (a, b) {
        return (a.data + a.horario).localeCompare(b.data + b.horario);
    });

    let html = "";
    let quantidade = 0;

    for (let i = 0; i < ordenadas.length; i++) {
        const c = ordenadas[i];

        if (filtro !== "todas" && c.status !== filtro) {
            continue;
        }

        const paciente = buscarPaciente(c.pacienteId);
        const profissional = buscarProfissional(c.profissionalId);
        const aparencia = aparenciaStatus(c.status);

        const nomePaciente = paciente ? escaparTexto(paciente.nome) : "(paciente removido)";
        const nomeProfissional = profissional ? escaparTexto(profissional.nome) : "(profissional removido)";

        html +=
            "<tr>" +
            "<td>" + formatarData(c.data) + "</td>" +
            "<td>" + c.horario + "</td>" +
            "<td>" + nomePaciente + "</td>" +
            "<td>" + nomeProfissional + "</td>" +
            '<td><span class="badge ' + aparencia.classe + '">' + c.status + "</span></td>" +
            '<td class="text-end text-nowrap">' +
            '<button type="button" class="btn btn-sm btn-outline-devir me-1" data-status-consulta="' + c.id + '">' + aparencia.textoBotao + "</button>" +
            '<button type="button" class="btn btn-sm btn-outline-danger" data-excluir-consulta="' + c.id + '">Excluir</button>' +
            "</td></tr>";

        quantidade++;
    }

    corpo.innerHTML = html;
    document.getElementById("sem-consultas").hidden = quantidade > 0;
}

function atualizarResumo() {
    const hoje = dataDeHoje();
    let agendadas = 0;
    let deHoje = 0;

    for (let i = 0; i < consultas.length; i++) {
        if (consultas[i].status === "Agendado") {
            agendadas++;
        }
        if (consultas[i].data === hoje) {
            deHoje++;
        }
    }

    document.getElementById("total-profissionais").textContent = profissionais.length;
    document.getElementById("total-pacientes").textContent = pacientes.length;
    document.getElementById("total-hoje").textContent = deHoje;
    document.getElementById("total-agendadas").textContent = agendadas;
}

// Redesenha tudo que depende dos dados
function atualizarTudo() {
    renderizarCardsProfissionais();
    renderizarListaProfissionais();
    renderizarListaPacientes();
    preencherSelects();
    renderizarTabela();
    preencherFiltroEspecialidade();
    renderizarAgenda();
    atualizarResumo();
}


/* ---------------------------------------------------------
   8. AGENDA MULTIDISCIPLINAR
   Visão do dia: linhas = horários; colunas = profissionais.
   Visão do mês: um quadro por dia com as consultas.
   --------------------------------------------------------- */

let visaoAgenda = "dia";

const NOMES_MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Decide qual visão desenhar
function renderizarAgenda() {
    if (visaoAgenda === "mes") {
        renderizarMes();
    } else {
        renderizarAgendaDia();
    }
}

// Troca entre "dia" e "mes" e atualiza os botões
function mudarVisao(visao) {
    visaoAgenda = visao;
    gravarSessao("devir_visao", visao);

    const botaoDia = document.getElementById("visao-dia-btn");
    const botaoMes = document.getElementById("visao-mes-btn");

    botaoDia.classList.toggle("active", visao === "dia");
    botaoMes.classList.toggle("active", visao === "mes");
    botaoDia.setAttribute("aria-pressed", visao === "dia");
    botaoMes.setAttribute("aria-pressed", visao === "mes");

    document.getElementById("visao-dia").hidden = (visao !== "dia");
    document.getElementById("visao-mes").hidden = (visao !== "mes");

    renderizarAgenda();
}

// Verifica se a consulta é de um profissional que passa no filtro
function passaNoFiltro(consulta, filtro) {
    if (filtro === "todas") {
        return true;
    }
    const profissional = buscarProfissional(consulta.profissionalId);
    return profissional !== null && profissional.especialidade === filtro;
}

function renderizarMes() {
    const campoDia = document.getElementById("agenda-dia");
    if (campoDia.value === "") {
        campoDia.value = dataDeHoje();
    }

    const filtro = document.getElementById("agenda-filtro-especialidade").value;
    const ano = Number(campoDia.value.slice(0, 4));
    const mes = Number(campoDia.value.slice(5, 7));           // 1 a 12
    const prefixo = campoDia.value.slice(0, 7);                // "aaaa-mm"

    const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay(); // 0 = domingo
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const hoje = dataDeHoje();

    // Separa as consultas do mês por dia, em ordem de horário
    const doMes = consultas.filter(function (c) {
        return c.data.slice(0, 7) === prefixo && passaNoFiltro(c, filtro);
    }).sort(function (a, b) {
        return a.horario.localeCompare(b.horario);
    });

    let html = "<tr>";

    // Quadros vazios antes do dia 1
    for (let i = 0; i < primeiroDiaSemana; i++) {
        html += '<td class="fora-do-mes"></td>';
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataISO = prefixo + "-" + String(dia).padStart(2, "0");
        const doDia = doMes.filter(function (c) { return c.data === dataISO; });

        let itens = "";
        const limite = 3;

        for (let i = 0; i < doDia.length && i < limite; i++) {
            const paciente = buscarPaciente(doDia[i].pacienteId);
            const profissional = buscarProfissional(doDia[i].profissionalId);
            const nomePaciente = paciente ? paciente.nome.split(" ")[0] : "?";
            const nomeProfissional = profissional ? profissional.nome.split(" ")[0] : "?";

            itens += '<span class="item' + (doDia[i].status === "Concluído" ? " concluida" : "") + '">' +
                doDia[i].horario + " " + escaparTexto(nomePaciente) + " · " + escaparTexto(nomeProfissional) + "</span>";
        }

        if (doDia.length > limite) {
            itens += '<span class="mais">+' + (doDia.length - limite) + " mais</span>";
        }

        html += '<td><button type="button" class="dia-mes' + (dataISO === hoje ? " hoje" : "") +
            '" data-dia-mes="' + dataISO + '" aria-label="Abrir agenda de ' + formatarData(dataISO) +
            ", " + doDia.length + ' consulta(s)">' +
            '<span class="numero">' + dia + "</span>" + itens + "</button></td>";

        // Fecha a semana no sábado
        if ((primeiroDiaSemana + dia) % 7 === 0 && dia < diasNoMes) {
            html += "</tr><tr>";
        }
    }

    // Quadros vazios depois do último dia
    const sobra = (7 - ((primeiroDiaSemana + diasNoMes) % 7)) % 7;
    for (let i = 0; i < sobra; i++) {
        html += '<td class="fora-do-mes"></td>';
    }
    html += "</tr>";

    document.getElementById("calendario-corpo").innerHTML = html;
    document.getElementById("titulo-dia").textContent = NOMES_MESES[mes - 1] + " de " + ano;
    document.getElementById("resumo-dia").textContent =
        doMes.length + (doMes.length === 1 ? " atendimento" : " atendimentos") + " neste mês";
}

// Soma meses e volta para o dia 1 do mês
function somarMeses(dataISO, meses) {
    const data = new Date(Number(dataISO.slice(0, 4)), Number(dataISO.slice(5, 7)) - 1 + meses, 1);
    return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0") + "-01";
}

// Lista os horários do expediente de 30 em 30 minutos
function gerarHorarios() {
    const horarios = [];
    const inicio = Number(HORA_INICIO.slice(0, 2));
    const fim = Number(HORA_FIM.slice(0, 2));

    for (let hora = inicio; hora <= fim; hora++) {
        const hh = String(hora).padStart(2, "0");
        horarios.push(hh + ":00");

        if (hora < fim) {
            horarios.push(hh + ":30");
        }
    }

    return horarios;
}

// Monta as opções do filtro com as especialidades cadastradas
function preencherFiltroEspecialidade() {
    const select = document.getElementById("agenda-filtro-especialidade");
    const selecionada = select.value;
    const especialidades = [];

    for (let i = 0; i < profissionais.length; i++) {
        if (especialidades.indexOf(profissionais[i].especialidade) === -1) {
            especialidades.push(profissionais[i].especialidade);
        }
    }

    especialidades.sort();

    let html = '<option value="todas">Todas as especialidades</option>';
    for (let i = 0; i < especialidades.length; i++) {
        html += "<option>" + escaparTexto(especialidades[i]) + "</option>";
    }
    select.innerHTML = html;

    // Mantém a escolha anterior, se ela ainda existir
    if (especialidades.indexOf(selecionada) !== -1) {
        select.value = selecionada;
    }
}

function buscarConsultaNoHorario(profissionalId, data, horario) {
    for (let i = 0; i < consultas.length; i++) {
        const c = consultas[i];
        if (c.profissionalId === profissionalId && c.data === data && c.horario === horario) {
            return c;
        }
    }
    return null;
}

function renderizarAgendaDia() {
    const campoDia = document.getElementById("agenda-dia");
    const filtro = document.getElementById("agenda-filtro-especialidade").value;

    if (campoDia.value === "") {
        campoDia.value = dataDeHoje();
    }
    const dia = campoDia.value;

    // Profissionais que aparecem como colunas
    const colunas = [];
    for (let i = 0; i < profissionais.length; i++) {
        if (filtro === "todas" || profissionais[i].especialidade === filtro) {
            colunas.push(profissionais[i]);
        }
    }

    let titulo = dataPorExtenso(dia);
    titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
    if (dia === dataDeHoje()) {
        titulo += " (hoje)";
    }
    document.getElementById("titulo-dia").textContent = titulo;

    // Cabeçalho: uma coluna por profissional
    let cabecalho = '<tr><th scope="col" class="coluna-hora">Horário</th>';
    for (let i = 0; i < colunas.length; i++) {
        cabecalho += '<th scope="col">' + escaparTexto(colunas[i].nome) +
            '<br><small class="fw-normal text-body-secondary">' + escaparTexto(colunas[i].especialidade) + "</small></th>";
    }
    cabecalho += "</tr>";

    const horarios = gerarHorarios();
    const passado = dia < dataDeHoje();
    let corpo = "";
    let ocupados = 0;

    for (let h = 0; h < horarios.length; h++) {
        const horario = horarios[h];
        corpo += '<tr><th scope="row" class="coluna-hora">' + horario + "</th>";

        for (let i = 0; i < colunas.length; i++) {
            const consulta = buscarConsultaNoHorario(colunas[i].id, dia, horario);

            if (consulta) {
                ocupados++;
                const paciente = buscarPaciente(consulta.pacienteId);
                const nome = paciente ? escaparTexto(paciente.nome) : "(paciente removido)";
                const aparencia = aparenciaStatus(consulta.status);
                const modalidade = paciente ? paciente.modalidade : "";

                corpo +=
                    '<td class="celula-ocupada ' + (consulta.status === "Concluído" ? "concluida" : "") + '">' +
                    '<div class="fw-semibold">' + nome + "</div>" +
                    '<div class="d-flex align-items-center gap-1 flex-wrap">' +
                    '<span class="badge ' + aparencia.classe + '">' + consulta.status + "</span>" +
                    '<small class="text-body-secondary">' + escaparTexto(modalidade) + "</small>" +
                    '<button type="button" class="btn btn-link btn-sm p-0 ms-auto" data-status-consulta="' + consulta.id + '">' +
                    aparencia.textoBotao + "</button></div></td>";
            } else if (passado || (dia === dataDeHoje() && horario < horaAgora())) {
                corpo += '<td class="celula-passada"></td>';
            } else {
                corpo += '<td class="p-0"><button type="button" class="btn-livre" data-livre-profissional="' +
                    colunas[i].id + '" data-livre-horario="' + horario + '" aria-label="Agendar ' +
                    escaparTexto(colunas[i].nome) + " às " + horario + '">Livre</button></td>';
            }
        }

        corpo += "</tr>";
    }

    document.getElementById("agenda-cabecalho").innerHTML = colunas.length > 0 ? cabecalho : "";
    document.getElementById("agenda-corpo").innerHTML = colunas.length > 0 ? corpo : "";
    document.getElementById("agenda-sem-profissionais").hidden = colunas.length > 0;
    document.getElementById("resumo-dia").textContent =
        ocupados + (ocupados === 1 ? " atendimento" : " atendimentos") + " neste dia · " + colunas.length +
        (colunas.length === 1 ? " profissional" : " profissionais") + " na grade";
}

// Setas ‹ ›: andam um dia ou um mês, conforme a visão
function mudarPeriodo(passo) {
    const campoDia = document.getElementById("agenda-dia");
    const atual = campoDia.value || dataDeHoje();

    if (visaoAgenda === "mes") {
        campoDia.value = somarMeses(atual, passo);
    } else {
        campoDia.value = somarDias(atual, passo);
    }

    renderizarAgenda();
}

// Clique num horário livre: abre a aba Consultas já preenchida
function abrirAgendamento(profissionalId, horario) {
    abrirAba("aba-consultas");

    document.getElementById("agenda-profissional").value = profissionalId;
    document.getElementById("agenda-data").value = document.getElementById("agenda-dia").value;
    document.getElementById("agenda-horario").value = horario;

    const campoPaciente = document.getElementById("agenda-paciente");
    campoPaciente.focus();

    if (pacientes.length === 0) {
        mostrarMensagem("Cadastre um paciente na aba Pacientes antes de agendar.", "warning");
    }
}


/* ---------------------------------------------------------
   9. ABAS DA RECEPÇÃO
   --------------------------------------------------------- */

function abrirAba(idAba) {
    const botao = document.getElementById(idAba);

    if (window.bootstrap) {
        bootstrap.Tab.getOrCreateInstance(botao).show();
    }
}

function configurarAbas() {
    const botoes = document.querySelectorAll("#abas-recepcao button");

    // Lembra a última aba aberta
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("shown.bs.tab", function () {
            gravarSessao("devir_aba", this.id);
        });
    }

    const abaSalva = lerSessao("devir_aba");
    if (abaSalva && document.getElementById(abaSalva)) {
        abrirAba(abaSalva);
    }
}


/* ---------------------------------------------------------
   10. INICIALIZAÇÃO
   --------------------------------------------------------- */

function configurarEventos() {
    document.getElementById("form-profissional").addEventListener("submit", cadastrarProfissional);
    document.getElementById("form-paciente").addEventListener("submit", cadastrarPaciente);
    document.getElementById("form-agendamento").addEventListener("submit", agendarConsulta);

    document.getElementById("nascimento-paciente").addEventListener("change", verificarIdade);
    document.getElementById("nascimento-paciente").addEventListener("input", verificarIdade);
    document.getElementById("filtro-status").addEventListener("change", renderizarTabela);
    document.getElementById("busca-paciente").addEventListener("input", renderizarListaPacientes);

    // Agenda (visões do dia e do mês)
    document.getElementById("agenda-dia").value = dataDeHoje();
    document.getElementById("agenda-dia").addEventListener("change", renderizarAgenda);
    document.getElementById("agenda-filtro-especialidade").addEventListener("change", renderizarAgenda);
    document.getElementById("dia-anterior").addEventListener("click", function () { mudarPeriodo(-1); });
    document.getElementById("dia-seguinte").addEventListener("click", function () { mudarPeriodo(1); });
    document.getElementById("dia-hoje").addEventListener("click", function () {
        document.getElementById("agenda-dia").value = dataDeHoje();
        renderizarAgenda();
    });
    document.getElementById("visao-dia-btn").addEventListener("click", function () { mudarVisao("dia"); });
    document.getElementById("visao-mes-btn").addEventListener("click", function () { mudarVisao("mes"); });

    // Não permite escolher datas passadas no calendário
    document.getElementById("agenda-data").min = dataDeHoje();
    document.getElementById("nascimento-paciente").max = dataDeHoje();

    // Botão "Excluir" da janela de confirmação
    document.getElementById("botao-confirmar").addEventListener("click", function () {
        bootstrap.Modal.getInstance(document.getElementById("janela-confirmacao")).hide();

        if (acaoConfirmada) {
            acaoConfirmada();
            acaoConfirmada = null;
        }
    });

    // Um único "ouvinte" para todos os botões das listas e da tabela
    document.getElementById("recepcao").addEventListener("click", function (evento) {
        const botao = evento.target.closest("button");

        if (!botao) {
            return;
        }

        if (botao.dataset.excluirProfissional) {
            excluirProfissional(botao.dataset.excluirProfissional);
        } else if (botao.dataset.excluirPaciente) {
            excluirPaciente(botao.dataset.excluirPaciente);
        } else if (botao.dataset.statusConsulta) {
            alternarStatus(botao.dataset.statusConsulta);
        } else if (botao.dataset.excluirConsulta) {
            excluirConsulta(botao.dataset.excluirConsulta);
        } else if (botao.dataset.diaMes) {
            // Clique num dia do calendário: abre a visão do dia
            document.getElementById("agenda-dia").value = botao.dataset.diaMes;
            mudarVisao("dia");
        } else if (botao.dataset.livreProfissional) {
            abrirAgendamento(botao.dataset.livreProfissional, botao.dataset.livreHorario);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    carregarDados();
    configurarNavegacao();
    configurarLogin();
    configurarEventos();
    atualizarTudo();
    configurarAbas();

    if (lerSessao("devir_visao") === "mes") {
        mudarVisao("mes");
    }

    // Se a recepção já estava aberta nesta aba, continua nela
    if (estaLogado() && lerSessao("devir_tela") === "recepcao") {
        mostrarTela("recepcao");
    }
});
