// =========================
// PEGANDO ELEMENTOS DAS TELAS
// =========================

const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const telaPrincipal = document.getElementById("telaPrincipal");
const telaSolicitacao = document.getElementById("telaSolicitacao");
const telaPrestadorServico = document.getElementById("telaPrestadorServico");
const telaChat = document.getElementById("telaChat");
const telaMeusAtendimentos = document.getElementById("telaMeusAtendimentos");
const telaPerfil = document.getElementById("telaPerfil");
const telaPerfilPublico = document.getElementById("telaPerfilPublico");


// =========================
// PEGANDO FORMULÁRIOS
// =========================

const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const formSolicitacao = document.getElementById("formSolicitacao");
const formChat = document.getElementById("formChat");
const formPerfil = document.getElementById("formPerfil");

// =========================
// PEGANDO BOTÕES
// =========================

const btnAbrirCadastro = document.getElementById("btnAbrirCadastro");
const btnVoltarLogin = document.getElementById("btnVoltarLogin");
const btnSair = document.getElementById("btnSair");
const btnVoltarServicos = document.getElementById("btnVoltarServicos");

const btnAlterarDisponibilidade = document.getElementById("btnAlterarDisponibilidade");
const btnProcurarClientes = document.getElementById("btnProcurarClientes");
const btnVoltarPainelPrestador = document.getElementById("btnVoltarPainelPrestador");
const btnVoltarChat = document.getElementById("btnVoltarChat");
const btnMeusAtendimentos = document.getElementById("btnMeusAtendimentos");
const btnVoltarMeusAtendimentos = document.getElementById("btnVoltarMeusAtendimentos");
const btnUsarLocalizacao = document.getElementById("btnUsarLocalizacao");
const btnAtualizarLocalizacaoPrestador = document.getElementById("btnAtualizarLocalizacaoPrestador");
const btnAbrirPerfil = document.getElementById("btnAbrirPerfil");
const btnVoltarPerfil = document.getElementById("btnVoltarPerfil");
const btnVoltarPerfilPublico = document.getElementById("btnVoltarPerfilPublico");

// =========================
// MENSAGENS E TEXTOS
// =========================

const mensagemLogin = document.getElementById("mensagemLogin");
const mensagemCadastro = document.getElementById("mensagemCadastro");
const usuarioLogado = document.getElementById("usuarioLogado");

const tituloServico = document.getElementById("tituloServico");
const tituloServicoPrestador = document.getElementById("tituloServicoPrestador");
const descricaoServicoPrestador = document.getElementById("descricaoServicoPrestador");
const luzDisponibilidade = document.getElementById("luzDisponibilidade");
const textoDisponibilidade = document.getElementById("textoDisponibilidade");
const listaClientesPrestador = document.getElementById("listaClientesPrestador");

const infoChat = document.getElementById("infoChat");
const areaMensagens = document.getElementById("areaMensagens");
const mensagemChat = document.getElementById("mensagemChat");
const listaMeusAtendimentos = document.getElementById("listaMeusAtendimentos");
const statusLocalizacao = document.getElementById("statusLocalizacao");
const statusLocalizacaoPrestador = document.getElementById("statusLocalizacaoPrestador");
const compartilharMapaPrestador = document.getElementById("compartilharMapaPrestador");

const fotoPerfilTopo = document.getElementById("fotoPerfilTopo");
const nomePerfilTopo = document.getElementById("nomePerfilTopo");
const estrelasPerfilTopo = document.getElementById("estrelasPerfilTopo");
const fotoPerfilGrande = document.getElementById("fotoPerfilGrande");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const perfilEstrelas = document.getElementById("perfilEstrelas");
const perfilTipoConta = document.getElementById("perfilTipoConta");
const perfilNome = document.getElementById("perfilNome");
const perfilIdade = document.getElementById("perfilIdade");
const perfilTelefone = document.getElementById("perfilTelefone");
const perfilBairro = document.getElementById("perfilBairro");
const perfilDescricao = document.getElementById("perfilDescricao");
const mensagemPerfil = document.getElementById("mensagemPerfil");
const listaAvaliacoesPerfil = document.getElementById("listaAvaliacoesPerfil");
const fotoPerfilPublico = document.getElementById("fotoPerfilPublico");
const nomePerfilPublico = document.getElementById("nomePerfilPublico");
const tipoPerfilPublico = document.getElementById("tipoPerfilPublico");
const estrelasPerfilPublico = document.getElementById("estrelasPerfilPublico");
const bairroPerfilPublico = document.getElementById("bairroPerfilPublico");
const descricaoPerfilPublico = document.getElementById("descricaoPerfilPublico");
const listaAvaliacoesPerfilPublico = document.getElementById("listaAvaliacoesPerfilPublico");

// =========================
// CONFIGURAÇÕES GERAIS
// =========================

const API_URL = "https://autohelp-zxzr.onrender.com";

let usuarioAtual = null;
let servicoSelecionado = "";
let prestadorDisponivel = true;
let solicitacaoAtualChat = null;
let intervaloChat = null;
let intervaloLocalizacaoPrestador = null;
let telaAnteriorPerfilPublico = telaPrincipal;

// =========================
// ABRIR TELA DE CADASTRO
// =========================

btnAbrirCadastro.addEventListener("click", function () {
  telaLogin.classList.add("hidden");
  telaCadastro.classList.remove("hidden");
  mensagemLogin.textContent = "";
});

// =========================
// VOLTAR PARA LOGIN
// =========================

btnVoltarLogin.addEventListener("click", function () {
  telaCadastro.classList.add("hidden");
  telaLogin.classList.remove("hidden");
  mensagemCadastro.textContent = "";
});

// =========================
// CADASTRO
// =========================

formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosCadastro = {
    nome: document.getElementById("cadastroNome").value,
    idade: document.getElementById("cadastroIdade").value,
    tipo: document.getElementById("cadastroTipo").value,
    email: document.getElementById("cadastroEmail").value,
    senha: document.getElementById("cadastroSenha").value
  };

  try {
    const resposta = await fetch(`${API_URL}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosCadastro)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mensagemCadastro.textContent = resultado.mensagem;
      mensagemCadastro.style.color = "red";
      return;
    }

    mensagemCadastro.textContent = resultado.mensagem;
    mensagemCadastro.style.color = "green";

    formCadastro.reset();

    setTimeout(function () {
      telaCadastro.classList.add("hidden");
      telaLogin.classList.remove("hidden");
      mensagemCadastro.textContent = "";
    }, 1200);

  } catch (erro) {
    mensagemCadastro.textContent = "Erro ao conectar com o servidor.";
    mensagemCadastro.style.color = "red";
  }
});

// =========================
// LOGIN
// =========================

formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosLogin = {
    email: document.getElementById("loginEmail").value,
    senha: document.getElementById("loginSenha").value
  };

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosLogin)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mensagemLogin.textContent = resultado.mensagem;
      mensagemLogin.style.color = "red";
      return;
    }

    usuarioAtual = resultado.usuario;

    await carregarPerfilUsuario();

    telaLogin.classList.add("hidden");
    telaPrincipal.classList.remove("hidden");

    usuarioLogado.textContent = `Olá, ${usuarioAtual.nome}. Tipo de conta: ${usuarioAtual.tipo}.`;

    atualizarPerfilTopo();

    formLogin.reset();
    mensagemLogin.textContent = "";

  } catch (erro) {
    mensagemLogin.textContent = "Erro ao conectar com o servidor.";
    mensagemLogin.style.color = "red";
  }
});

// =========================
// PERFIL DO USUÁRIO
// =========================

function gerarEstrelas(quantidade) {
  let estrelas = "";
  const nota = Math.round(Number(quantidade) || 5);

  for (let i = 1; i <= 5; i++) {
    if (i <= nota) {
      estrelas += "★";
    } else {
      estrelas += "☆";
    }
  }

  return estrelas;
}

function formatarNota(usuario) {
  const nota = Number(usuario.estrelas || 5).toFixed(1);
  const total = usuario.totalAvaliacoes || 0;

  return `${gerarEstrelas(usuario.estrelas || 5)} (${nota}) - ${total} avaliação(ões)`;
}

async function carregarPerfilUsuario() {
  if (!usuarioAtual) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/perfil/${usuarioAtual.id}`);
    const perfil = await resposta.json();

    if (!resposta.ok) {
      return;
    }

    usuarioAtual = perfil;

    atualizarPerfilTopo();

  } catch (erro) {
    console.log("Erro ao carregar perfil.");
  }
}

function atualizarPerfilTopo() {
  if (!usuarioAtual) {
    return;
  }

  nomePerfilTopo.textContent = usuarioAtual.nome || "Usuário";
  estrelasPerfilTopo.textContent = formatarNota(usuarioAtual);

  if (usuarioAtual.fotoPerfil) {
    fotoPerfilTopo.style.backgroundImage = `url(${usuarioAtual.fotoPerfil})`;
  } else {
    fotoPerfilTopo.style.backgroundImage = "";
  }
}

// =========================
// HISTÓRICO DE AVALIAÇÕES NO PERFIL
// =========================

function carregarHistoricoAvaliacoesPerfil() {
  if (!usuarioAtual || !listaAvaliacoesPerfil) {
    return;
  }

  const avaliacoes = usuarioAtual.avaliacoesRecebidas || [];

  if (avaliacoes.length === 0) {
    listaAvaliacoesPerfil.innerHTML = `
      <p>
        Nenhuma avaliação recebida ainda.
      </p>
    `;

    return;
  }

  listaAvaliacoesPerfil.innerHTML = "";

  avaliacoes.forEach((avaliacao) => {
    const div = document.createElement("div");

    div.classList.add("avaliacao-perfil-card");

    div.innerHTML = `
      <strong>${avaliacao.nomeAvaliador || "Usuário"}</strong>

      <div class="avaliacao-perfil-estrelas">
        ${gerarEstrelas(avaliacao.estrelas)}
      </div>

      <p class="avaliacao-perfil-comentario">
        "${avaliacao.comentario || "Sem comentário."}"
      </p>

      <span class="avaliacao-perfil-data">
        ${avaliacao.criadaEm || ""}
      </span>
    `;

    listaAvaliacoesPerfil.appendChild(div);
  });
}

// =========================
// PERFIL PÚBLICO
// =========================

function guardarTelaAnteriorPerfilPublico() {
  if (!telaPrincipal.classList.contains("hidden")) {
    telaAnteriorPerfilPublico = telaPrincipal;
    return;
  }

  if (!telaPrestadorServico.classList.contains("hidden")) {
    telaAnteriorPerfilPublico = telaPrestadorServico;
    return;
  }

  if (!telaMeusAtendimentos.classList.contains("hidden")) {
    telaAnteriorPerfilPublico = telaMeusAtendimentos;
    return;
  }

  if (!telaChat.classList.contains("hidden")) {
    telaAnteriorPerfilPublico = telaChat;
    return;
  }

  telaAnteriorPerfilPublico = telaPrincipal;
}

function esconderTelasParaPerfilPublico() {
  telaPrincipal.classList.add("hidden");
  telaSolicitacao.classList.add("hidden");
  telaPrestadorServico.classList.add("hidden");
  telaMeusAtendimentos.classList.add("hidden");
  telaChat.classList.add("hidden");
  telaPerfil.classList.add("hidden");
}

function carregarAvaliacoesPerfilPublico(avaliacoes) {
  if (!listaAvaliacoesPerfilPublico) {
    return;
  }

  if (!avaliacoes || avaliacoes.length === 0) {
    listaAvaliacoesPerfilPublico.innerHTML = `
      <p>
        Nenhuma avaliação recebida ainda.
      </p>
    `;

    return;
  }

  listaAvaliacoesPerfilPublico.innerHTML = "";

  avaliacoes.forEach((avaliacao) => {
    const div = document.createElement("div");

    div.classList.add("avaliacao-perfil-card");

    div.innerHTML = `
      <strong>${avaliacao.nomeAvaliador || "Usuário"}</strong>

      <div class="avaliacao-perfil-estrelas">
        ${gerarEstrelas(avaliacao.estrelas)}
      </div>

      <p class="avaliacao-perfil-comentario">
        "${avaliacao.comentario || "Sem comentário."}"
      </p>

      <span class="avaliacao-perfil-data">
        ${avaliacao.criadaEm || ""}
      </span>
    `;

    listaAvaliacoesPerfilPublico.appendChild(div);
  });
}

async function abrirPerfilPublico(usuarioId) {
  guardarTelaAnteriorPerfilPublico();

  try {
    const resposta = await fetch(`${API_URL}/perfil/${usuarioId}`);
    const perfil = await resposta.json();

    if (!resposta.ok) {
      alert(perfil.mensagem || "Erro ao carregar perfil público.");
      return;
    }

    nomePerfilPublico.textContent = perfil.nome || "Usuário";
    tipoPerfilPublico.textContent = `Tipo de conta: ${perfil.tipo || "Não informado"}`;
    estrelasPerfilPublico.textContent = formatarNota(perfil);

    if (perfil.fotoPerfil) {
      fotoPerfilPublico.style.backgroundImage = `url(${perfil.fotoPerfil})`;
    } else {
      fotoPerfilPublico.style.backgroundImage = "";
    }

    bairroPerfilPublico.textContent = perfil.bairro
      ? `Bairro: ${perfil.bairro}`
      : "";

    descricaoPerfilPublico.textContent = perfil.descricao
      ? perfil.descricao
      : "Este usuário ainda não adicionou uma descrição.";

    carregarAvaliacoesPerfilPublico(perfil.avaliacoesRecebidas || []);

    esconderTelasParaPerfilPublico();
    telaPerfilPublico.classList.remove("hidden");

  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
}

btnVoltarPerfilPublico.addEventListener("click", function () {
  telaPerfilPublico.classList.add("hidden");
  telaAnteriorPerfilPublico.classList.remove("hidden");
});

async function abrirTelaPerfil() {
  if (!usuarioAtual) {
    return;
  }

  await carregarPerfilUsuario();

  telaPrincipal.classList.add("hidden");
  telaSolicitacao.classList.add("hidden");
  telaPrestadorServico.classList.add("hidden");
  telaMeusAtendimentos.classList.add("hidden");
  telaChat.classList.add("hidden");
  telaPerfilPublico.classList.add("hidden");
  telaPerfil.classList.remove("hidden");

  perfilNome.value = usuarioAtual.nome || "";
  perfilIdade.value = usuarioAtual.idade || "";
  perfilTelefone.value = usuarioAtual.telefone || "";
  perfilBairro.value = usuarioAtual.bairro || "";
  perfilDescricao.value = usuarioAtual.descricao || "";

  perfilTipoConta.textContent = `Tipo de conta: ${usuarioAtual.tipo}`;
  perfilEstrelas.textContent = formatarNota(usuarioAtual);

  if (usuarioAtual.fotoPerfil) {
    fotoPerfilGrande.style.backgroundImage = `url(${usuarioAtual.fotoPerfil})`;
  } else {
    fotoPerfilGrande.style.backgroundImage = "";
  }

  carregarHistoricoAvaliacoesPerfil();

  mensagemPerfil.textContent = "";
}

btnAbrirPerfil.addEventListener("click", function () {
  abrirTelaPerfil();
});

btnVoltarPerfil.addEventListener("click", function () {
  telaPerfil.classList.add("hidden");
  telaPrincipal.classList.remove("hidden");
});

inputFotoPerfil.addEventListener("change", function () {
  const arquivo = inputFotoPerfil.files[0];

  if (!arquivo) {
    return;
  }

  const leitor = new FileReader();

  leitor.onload = function () {
    usuarioAtual.fotoPerfil = leitor.result;

    fotoPerfilGrande.style.backgroundImage = `url(${usuarioAtual.fotoPerfil})`;

    atualizarPerfilTopo();
  };

  leitor.readAsDataURL(arquivo);
});

formPerfil.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosPerfil = {
    nome: perfilNome.value,
    idade: perfilIdade.value,
    telefone: perfilTelefone.value,
    bairro: perfilBairro.value,
    descricao: perfilDescricao.value,
    fotoPerfil: usuarioAtual.fotoPerfil || ""
  };

  try {
    const resposta = await fetch(`${API_URL}/perfil/${usuarioAtual.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosPerfil)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mensagemPerfil.textContent = resultado.mensagem;
      mensagemPerfil.style.color = "red";
      return;
    }

    usuarioAtual = resultado.usuario;

    usuarioLogado.textContent = `Olá, ${usuarioAtual.nome}. Tipo de conta: ${usuarioAtual.tipo}.`;

    atualizarPerfilTopo();

    perfilNome.value = usuarioAtual.nome || "";
    perfilIdade.value = usuarioAtual.idade || "";
    perfilTelefone.value = usuarioAtual.telefone || "";
    perfilBairro.value = usuarioAtual.bairro || "";
    perfilDescricao.value = usuarioAtual.descricao || "";
    perfilEstrelas.textContent = formatarNota(usuarioAtual);

    if (usuarioAtual.fotoPerfil) {
      fotoPerfilGrande.style.backgroundImage = `url(${usuarioAtual.fotoPerfil})`;
    } else {
      fotoPerfilGrande.style.backgroundImage = "";
    }

    carregarHistoricoAvaliacoesPerfil();

    mensagemPerfil.textContent = resultado.mensagem;
    mensagemPerfil.style.color = "green";

  } catch (erro) {
    mensagemPerfil.textContent = "Erro ao conectar com o servidor.";
    mensagemPerfil.style.color = "red";
  }
});

// =========================
// ABRIR SERVIÇO
// =========================

function abrirServico(servico) {
  servicoSelecionado = servico;

  if (servico === "IA") {
    alert("A IA será desenvolvida em uma próxima etapa.");
    return;
  }

  if (usuarioAtual.tipo === "Cliente") {
    abrirTelaSolicitacaoCliente(servico);
  }

  if (usuarioAtual.tipo === "Prestador") {
    abrirTelaPrestador(servico);
  }
}

// =========================
// TELA DE SOLICITAÇÃO DO CLIENTE
// =========================

function abrirTelaSolicitacaoCliente(servico) {
  tituloServico.textContent = servico;

  telaPrincipal.classList.add("hidden");
  telaSolicitacao.classList.remove("hidden");
}

// =========================
// VOLTAR PARA SERVIÇOS
// =========================

btnVoltarServicos.addEventListener("click", function () {
  telaSolicitacao.classList.add("hidden");
  telaPrincipal.classList.remove("hidden");
});

// =========================
// GPS DO CLIENTE
// =========================

btnUsarLocalizacao.addEventListener("click", function () {
  if (!navigator.geolocation) {
    statusLocalizacao.textContent = "Seu navegador não suporta GPS.";
    statusLocalizacao.style.color = "red";
    return;
  }

  statusLocalizacao.textContent = "Obtendo localização...";
  statusLocalizacao.style.color = "#555";

  navigator.geolocation.getCurrentPosition(
    function (posicao) {
      const latitude = posicao.coords.latitude;
      const longitude = posicao.coords.longitude;

      document.getElementById("latitude").value = latitude;
      document.getElementById("longitude").value = longitude;

      statusLocalizacao.textContent = "Localização obtida com sucesso.";
      statusLocalizacao.style.color = "green";
    },

    function () {
      statusLocalizacao.textContent =
        "Não foi possível obter sua localização. Permita o acesso ao GPS no navegador.";
      statusLocalizacao.style.color = "red";
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});

// =========================
// ENVIAR SOLICITAÇÃO DO CLIENTE
// =========================

formSolicitacao.addEventListener("submit", async function (e) {
  e.preventDefault();

  const latitudeCliente = document.getElementById("latitude").value;
const longitudeCliente = document.getElementById("longitude").value;

const dadosSolicitacao = {
  usuarioId: Number(usuarioAtual.id),
  nomeCliente: usuarioAtual.nome,
  servico: servicoSelecionado,
  endereco: document.getElementById("endereco").value,
  veiculo: document.getElementById("veiculo").value,
  descricao: document.getElementById("descricaoProblema").value,
  telefone: document.getElementById("telefone").value,
  latitude: latitudeCliente ? Number(latitudeCliente) : null,
  longitude: longitudeCliente ? Number(longitudeCliente) : null
};

  try {
    const resposta = await fetch(`${API_URL}/solicitacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosSolicitacao)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
  console.log("Erro completo da solicitação:", resultado);
  alert(`${resultado.mensagem}\n\nDetalhe: ${resultado.erro || "Sem detalhe retornado"}`);
  return;
}
    alert("Solicitação enviada com sucesso!");

    formSolicitacao.reset();
    statusLocalizacao.textContent = "";

    telaSolicitacao.classList.add("hidden");
    telaPrincipal.classList.remove("hidden");

  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
});

// =========================
// TELA DO PRESTADOR
// =========================

function abrirTelaPrestador(servico) {
  tituloServicoPrestador.textContent = `Área de ${servico}`;

  descricaoServicoPrestador.textContent =
    `Veja clientes que solicitaram ${servico} e gerencie sua disponibilidade.`;

  listaClientesPrestador.innerHTML = "";

  telaPrincipal.classList.add("hidden");
  telaPrestadorServico.classList.remove("hidden");

  iniciarAtualizacaoAutomaticaPrestador();
}

// =========================
// ALTERAR DISPONIBILIDADE
// =========================

btnAlterarDisponibilidade.addEventListener("click", function () {
  prestadorDisponivel = !prestadorDisponivel;

  if (prestadorDisponivel) {
    textoDisponibilidade.textContent = "Disponível";

    luzDisponibilidade.classList.remove("vermelha");
    luzDisponibilidade.classList.add("verde");
  } else {
    textoDisponibilidade.textContent = "Ocupado";

    luzDisponibilidade.classList.remove("verde");
    luzDisponibilidade.classList.add("vermelha");
  }
});

// =========================
// ATUALIZAR LOCALIZAÇÃO DO PRESTADOR
// =========================

btnAtualizarLocalizacaoPrestador.addEventListener("click", function () {
  atualizarLocalizacaoPrestador();
});

async function atualizarLocalizacaoPrestador() {
  if (!navigator.geolocation) {
    statusLocalizacaoPrestador.textContent = "Seu navegador não suporta GPS.";
    statusLocalizacaoPrestador.style.color = "red";
    return;
  }

  if (!usuarioAtual || usuarioAtual.tipo !== "Prestador") {
    return;
  }

  statusLocalizacaoPrestador.textContent = "Obtendo localização do prestador...";
  statusLocalizacaoPrestador.style.color = "#555";

  navigator.geolocation.getCurrentPosition(
    async function (posicao) {
      try {
        const respostaSolicitacoes = await fetch(`${API_URL}/solicitacoes`);
        const solicitacoes = await respostaSolicitacoes.json();

        const meusAtendimentos = solicitacoes.filter((solicitacao) => {
          return (
            solicitacao.prestadorId === usuarioAtual.id &&
            solicitacao.status === "Em atendimento"
          );
        });

        if (meusAtendimentos.length === 0) {
          statusLocalizacaoPrestador.textContent =
            "Você ainda não possui atendimentos em andamento para atualizar.";
          statusLocalizacaoPrestador.style.color = "red";
          return;
        }

        for (const atendimento of meusAtendimentos) {
          await fetch(`${API_URL}/solicitacoes/${atendimento.id}/localizacao-prestador`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              prestadorId: usuarioAtual.id,
              latitudePrestador: posicao.coords.latitude,
              longitudePrestador: posicao.coords.longitude,
              compartilharMapaPrestador: compartilharMapaPrestador.checked
            })
          });
        }

        statusLocalizacaoPrestador.textContent =
          "Localização do prestador atualizada com sucesso.";
        statusLocalizacaoPrestador.style.color = "green";

        if (typeof btnProcurarClientes !== "undefined") {
          btnProcurarClientes.click();
        }

      } catch (erro) {
        statusLocalizacaoPrestador.textContent =
          "Erro ao enviar localização para o servidor.";
        statusLocalizacaoPrestador.style.color = "red";
      }
    },

    function () {
      statusLocalizacaoPrestador.textContent =
        "Não foi possível obter sua localização.";
      statusLocalizacaoPrestador.style.color = "red";
    }
  );
}

// =========================
// ATUALIZAÇÃO AUTOMÁTICA A CADA 5 MINUTOS
// =========================

function iniciarAtualizacaoAutomaticaPrestador() {
  if (intervaloLocalizacaoPrestador) {
    clearInterval(intervaloLocalizacaoPrestador);
  }

  if (usuarioAtual && usuarioAtual.tipo === "Prestador") {
    intervaloLocalizacaoPrestador = setInterval(function () {
      atualizarLocalizacaoPrestador();
    }, 300000);
  }
}

// =========================
// PROCURAR CLIENTES
// =========================

btnProcurarClientes.addEventListener("click", async function () {

  listaClientesPrestador.innerHTML = "<p>Carregando...</p>";

  try {

    const resposta = await fetch(`${API_URL}/solicitacoes`);
    const solicitacoes = await resposta.json();

    listaClientesPrestador.innerHTML = "";

    // =========================
    // MEUS ATENDIMENTOS
    // =========================

    const meusAtendimentos = solicitacoes.filter((solicitacao) => {

      return (
        solicitacao.prestadorId === usuarioAtual.id &&
        (
          solicitacao.status === "Em atendimento" ||
          solicitacao.status === "Finalizado"
        )
      );

    });

    if (meusAtendimentos.length > 0) {

      listaClientesPrestador.innerHTML += `
        <h3>Meus Atendimentos</h3>
      `;

      meusAtendimentos.forEach((atendimento) => {

        let statusGpsPrestador = "<p><strong>GPS:</strong> localização ainda não atualizada.</p>";
        let botaoChatPrestador = "";
        let botaoFinalizarPrestador = "";
        let areaAvaliacaoPrestador = "";
        let statusFinalizacaoPrestador = "";

        if (atendimento.latitudePrestador && atendimento.longitudePrestador) {
          statusGpsPrestador = `
            <p><strong>GPS:</strong> localização enviada ao cliente.</p>
            <p><strong>Última atualização:</strong> ${atendimento.ultimaAtualizacaoPrestador || "Sem informação"}</p>
          `;
        }

        if (atendimento.status === "Em atendimento") {
          botaoChatPrestador = `
            <button onclick="abrirTelaChatPrestador(${atendimento.id})">
              Abrir Chat
            </button>
          `;

          statusFinalizacaoPrestador = `
            <p><strong>Cliente confirmou finalização:</strong> ${atendimento.clienteConfirmouFinalizacao ? "Sim" : "Não"}</p>
            <p><strong>Prestador confirmou finalização:</strong> ${atendimento.prestadorConfirmouFinalizacao ? "Sim" : "Não"}</p>
          `;

          if (atendimento.prestadorConfirmouFinalizacao) {
            botaoFinalizarPrestador = `
              <p><strong>Sua confirmação:</strong> registrada. Aguardando o cliente confirmar.</p>
            `;
          } else {
            botaoFinalizarPrestador = `
              <button onclick="finalizarAtendimento(${atendimento.id})">
                Confirmar Finalização
              </button>
            `;
          }
        }

        if (atendimento.status === "Finalizado") {
          botaoChatPrestador = `
            <p><strong>Chat:</strong> atendimento finalizado.</p>
          `;

          areaAvaliacaoPrestador = montarAreaAvaliacao(atendimento);
        }

        listaClientesPrestador.innerHTML += `
          <div class="cliente-card">

           <p><strong>Cliente:</strong> <span class="nome-clicavel" onclick="abrirPerfilPublico(${atendimento.usuarioId})">${atendimento.nomeCliente}</span></p>

            <p><strong>Serviço:</strong> ${atendimento.servico}</p>

            <p><strong>Status:</strong> ${atendimento.status}</p>

            ${statusGpsPrestador}

            ${botaoChatPrestador}

            ${statusFinalizacaoPrestador}

            ${botaoFinalizarPrestador}

            ${areaAvaliacaoPrestador}

          </div>
        `;

      });

    }

    // =========================
    // CLIENTES DISPONÍVEIS
    // =========================

    const clientesDisponiveis = solicitacoes.filter((solicitacao) => {

      return (
        solicitacao.servico === servicoSelecionado &&
        solicitacao.status === "Aguardando prestador"
      );

    });

    if (clientesDisponiveis.length > 0) {

      listaClientesPrestador.innerHTML += `
        <h3>Clientes Disponíveis</h3>
      `;

      clientesDisponiveis.forEach((cliente) => {

        let botaoMapa = "";

        if (cliente.latitude !== null && cliente.longitude !== null) {
          botaoMapa = `
            <button onclick="abrirMapa(${cliente.latitude}, ${cliente.longitude})">
              Abrir no Google Maps
            </button>
          `;
        }

        listaClientesPrestador.innerHTML += `
          <div class="cliente-card">

            <p><strong>Cliente:</strong> <span class="nome-clicavel" onclick="abrirPerfilPublico(${cliente.usuarioId})">${cliente.nomeCliente}</span></p>

            <p><strong>Serviço:</strong> ${cliente.servico}</p>

            <p><strong>Endereço:</strong> ${cliente.endereco}</p>

            <p><strong>Veículo:</strong> ${cliente.veiculo}</p>

            <p><strong>Pedido:</strong> ${cliente.descricao}</p>

            ${botaoMapa}

            <button onclick="aceitarSolicitacao(${cliente.id})">
              Aceitar Atendimento
            </button>

          </div>
        `;

      });

    }

    if (
      clientesDisponiveis.length === 0 &&
      meusAtendimentos.length === 0
    ) {

      listaClientesPrestador.innerHTML =
        "<p>Nenhum atendimento encontrado.</p>";

    }

  } catch (erro) {

    listaClientesPrestador.innerHTML =
      "<p>Erro ao carregar atendimentos.</p>";

  }

});

// =========================
// ABRIR GOOGLE MAPS
// =========================

function abrirMapa(latitude, longitude) {
  window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
}

// =========================
// CALCULAR DISTÂNCIA ENTRE CLIENTE E PRESTADOR
// =========================

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const raioTerraKm = 6371;

  const diferencaLat = grausParaRadianos(lat2 - lat1);
  const diferencaLon = grausParaRadianos(lon2 - lon1);

  const formula =
    Math.sin(diferencaLat / 2) * Math.sin(diferencaLat / 2) +
    Math.cos(grausParaRadianos(lat1)) *
      Math.cos(grausParaRadianos(lat2)) *
      Math.sin(diferencaLon / 2) *
      Math.sin(diferencaLon / 2);

  const angulo = 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));

  return raioTerraKm * angulo;
}

function grausParaRadianos(graus) {
  return graus * (Math.PI / 180);
}

// =========================
// ACEITAR SOLICITAÇÃO
// =========================

async function aceitarSolicitacao(id) {
  try {
    const resposta = await fetch(`${API_URL}/solicitacoes/${id}/aceitar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prestadorId: usuarioAtual.id,
        nomePrestador: usuarioAtual.nome
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem);
      return;
    }

    alert("Atendimento aceito com sucesso!");

    abrirTelaChat(resultado.solicitacao);
    atualizarLocalizacaoPrestador();

  } catch (erro) {
    alert("Erro ao aceitar solicitação.");
  }
}

// =========================
// FINALIZAR ATENDIMENTO
// =========================

async function finalizarAtendimento(id) {
  try {
    const resposta = await fetch(`${API_URL}/solicitacoes/${id}/finalizar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuarioId: usuarioAtual.id,
        tipoUsuario: usuarioAtual.tipo
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem);
      return;
    }

    alert(resultado.mensagem);

    if (usuarioAtual.tipo === "Prestador") {
      btnProcurarClientes.click();
    } else {
      carregarMeusAtendimentos();
    }

  } catch (erro) {
    alert("Erro ao finalizar atendimento.");
  }
}

// =========================
// MONTAR ÁREA DE AVALIAÇÃO
// =========================

function montarAreaAvaliacao(atendimento) {
  if (atendimento.status !== "Finalizado") {
    return "";
  }

  let avaliadoId = null;
  let nomeAvaliado = "";

  if (usuarioAtual.tipo === "Cliente") {
    avaliadoId = atendimento.prestadorId;
    nomeAvaliado = atendimento.nomePrestador || "Prestador";

    if (atendimento.avaliacaoCliente) {
      return `
        <p><strong>Avaliação:</strong> você já avaliou este prestador.</p>
      `;
    }
  }

  if (usuarioAtual.tipo === "Prestador") {
    avaliadoId = atendimento.usuarioId;
    nomeAvaliado = atendimento.nomeCliente || "Cliente";

    if (atendimento.avaliacaoPrestador) {
      return `
        <p><strong>Avaliação:</strong> você já avaliou este cliente.</p>
      `;
    }
  }

  if (!avaliadoId) {
    return "";
  }

  return `
    <div class="area-avaliacao">

      <p><strong>Avaliar ${nomeAvaliado}</strong></p>

      <select id="estrelasAvaliacao-${atendimento.id}">
        <option value="5">5 estrelas - Excelente</option>
        <option value="4">4 estrelas - Muito bom</option>
        <option value="3">3 estrelas - Bom</option>
        <option value="2">2 estrelas - Regular</option>
        <option value="1">1 estrela - Ruim</option>
      </select>

      <textarea
        id="comentarioAvaliacao-${atendimento.id}"
        placeholder="Comentário opcional"
      ></textarea>

      <button onclick="avaliarAtendimento(${atendimento.id}, ${avaliadoId})">
        Enviar Avaliação
      </button>

    </div>
  `;
}

// =========================
// AVALIAR ATENDIMENTO
// =========================

async function avaliarAtendimento(id, avaliadoId) {
  const estrelas = document.getElementById(`estrelasAvaliacao-${id}`).value;
  const comentario = document.getElementById(`comentarioAvaliacao-${id}`).value;

  try {
    const resposta = await fetch(`${API_URL}/solicitacoes/${id}/avaliar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avaliadorId: usuarioAtual.id,
        avaliadoId,
        estrelas,
        comentario
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem);
      return;
    }

    alert("Avaliação enviada com sucesso!");

    await carregarPerfilUsuario();

    if (usuarioAtual.tipo === "Prestador") {
      btnProcurarClientes.click();
    } else {
      carregarMeusAtendimentos();
    }

  } catch (erro) {
    alert("Erro ao enviar avaliação.");
  }
}

// =========================
// ABRIR TELA DE CHAT
// =========================

function abrirTelaChat(solicitacao) {
  solicitacaoAtualChat = solicitacao;

  telaPrincipal.classList.add("hidden");
  telaSolicitacao.classList.add("hidden");
  telaPrestadorServico.classList.add("hidden");
  telaMeusAtendimentos.classList.add("hidden");
 telaPerfil.classList.add("hidden");
 telaPerfilPublico.classList.add("hidden");
 telaChat.classList.remove("hidden");
  infoChat.textContent = `Atendimento #${solicitacao.id} - ${solicitacao.servico}`;

  carregarMensagensChat();

  if (intervaloChat) {
    clearInterval(intervaloChat);
  }

  intervaloChat = setInterval(carregarMensagensChat, 2000);
}

// =========================
// CARREGAR MENSAGENS DO CHAT
// =========================

async function carregarMensagensChat() {
  if (!solicitacaoAtualChat) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/solicitacoes/${solicitacaoAtualChat.id}/mensagens`);
    const mensagens = await resposta.json();

    if (!resposta.ok) {
      areaMensagens.innerHTML = "<p>Erro ao carregar mensagens.</p>";
      return;
    }

    areaMensagens.innerHTML = "";

    if (mensagens.length === 0) {
      areaMensagens.innerHTML = `
        <div class="mensagem">
          <strong>Sistema</strong>
          <p>Atendimento aceito. Agora você pode conversar com a outra pessoa.</p>
          <span>Chat iniciado</span>
        </div>
      `;
      return;
    }

    mensagens.forEach((mensagem) => {
      const div = document.createElement("div");
      div.classList.add("mensagem");

      div.innerHTML = `
        <strong>${mensagem.nomeUsuario} (${mensagem.tipoUsuario})</strong>
        <p>${mensagem.texto}</p>
        <span>${mensagem.enviadaEm}</span>
      `;

      areaMensagens.appendChild(div);
    });

    areaMensagens.scrollTop = areaMensagens.scrollHeight;

  } catch (erro) {
    areaMensagens.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
  }
}

// =========================
// ENVIAR MENSAGEM NO CHAT
// =========================

formChat.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!solicitacaoAtualChat) {
    alert("Nenhum atendimento selecionado.");
    return;
  }

  const texto = mensagemChat.value;

  if (texto.trim() === "") {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/solicitacoes/${solicitacaoAtualChat.id}/mensagens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usuarioId: usuarioAtual.id,
        nomeUsuario: usuarioAtual.nome,
        tipoUsuario: usuarioAtual.tipo,
        texto
      })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem);
      return;
    }

    mensagemChat.value = "";
    carregarMensagensChat();

  } catch (erro) {
    alert("Erro ao enviar mensagem.");
  }
});

// =========================
// MEUS ATENDIMENTOS DO CLIENTE
// =========================

btnMeusAtendimentos.addEventListener("click", function () {
  telaPrincipal.classList.add("hidden");
  telaMeusAtendimentos.classList.remove("hidden");

  carregarMeusAtendimentos();
});

// =========================
// CARREGAR MEUS ATENDIMENTOS
// =========================

async function carregarMeusAtendimentos() {
  listaMeusAtendimentos.innerHTML = "<p>Carregando atendimentos...</p>";

  try {
    const resposta = await fetch(`${API_URL}/solicitacoes`);
    const solicitacoes = await resposta.json();

    const meusAtendimentos = solicitacoes.filter((solicitacao) => {
      return solicitacao.usuarioId === usuarioAtual.id;
    });

    if (meusAtendimentos.length === 0) {
      listaMeusAtendimentos.innerHTML = "<p>Você ainda não possui atendimentos.</p>";
      return;
    }

    listaMeusAtendimentos.innerHTML = "";

    meusAtendimentos.forEach((atendimento) => {
      const div = document.createElement("div");
      div.classList.add("cliente-card");

      let botaoChat = "";
      let informacoesPrestador = "";
      let botaoFinalizar = "";
      let areaAvaliacao = "";
      let statusFinalizacao = "";

      if (atendimento.status === "Em atendimento") {
        botaoChat = `
          <button onclick="abrirTelaChatCliente(${atendimento.id})">
            Abrir Chat
          </button>
        `;

        statusFinalizacao = `
          <p><strong>Cliente confirmou finalização:</strong> ${atendimento.clienteConfirmouFinalizacao ? "Sim" : "Não"}</p>
          <p><strong>Prestador confirmou finalização:</strong> ${atendimento.prestadorConfirmouFinalizacao ? "Sim" : "Não"}</p>
        `;

        if (atendimento.clienteConfirmouFinalizacao) {
          botaoFinalizar = `
            <p><strong>Sua confirmação:</strong> registrada. Aguardando o prestador confirmar.</p>
          `;
        } else {
          botaoFinalizar = `
            <button onclick="finalizarAtendimento(${atendimento.id})">
              Confirmar Finalização
            </button>
          `;
        }
      } else if (atendimento.status === "Finalizado") {
        botaoChat = `
          <p><strong>Chat:</strong> atendimento finalizado.</p>
        `;

        areaAvaliacao = montarAreaAvaliacao(atendimento);
      } else {
        botaoChat = `
          <p><strong>Chat:</strong> disponível quando um prestador aceitar.</p>
        `;
      }

      if (
  atendimento.latitude !== null &&
  atendimento.longitude !== null &&
  atendimento.latitudePrestador !== null &&
  atendimento.longitudePrestador !== null
) {
        const distancia = calcularDistanciaKm(
          Number(atendimento.latitude),
          Number(atendimento.longitude),
          Number(atendimento.latitudePrestador),
          Number(atendimento.longitudePrestador)
        );

        informacoesPrestador += `
          <p><strong>Distância aproximada do prestador:</strong> ${distancia.toFixed(2)} km</p>
          <p><strong>Última atualização do prestador:</strong> ${atendimento.ultimaAtualizacaoPrestador || "Sem informação"}</p>
        `;

        if (atendimento.compartilharMapaPrestador === true) {
          informacoesPrestador += `
            <button onclick="abrirMapa(${atendimento.latitudePrestador}, ${atendimento.longitudePrestador})">
              Ver prestador no Google Maps
            </button>
          `;
        } else {
          informacoesPrestador += `
            <p><strong>Mapa:</strong> o prestador não permitiu compartilhar a localização exata.</p>
          `;
        }
      } else if (atendimento.status === "Em atendimento") {
        informacoesPrestador += `
          <p><strong>Distância:</strong> aguardando atualização da localização do prestador.</p>
        `;
      }

      div.innerHTML = `
        <p><strong>Serviço:</strong> ${atendimento.servico}</p>
        <p><strong>Endereço:</strong> ${atendimento.endereco}</p>
        <p><strong>Veículo:</strong> ${atendimento.veiculo}</p>
        <p><strong>Pedido:</strong> ${atendimento.descricao}</p>
        <p><strong>Status:</strong> ${atendimento.status}</p>
        <p><strong>Prestador:</strong> ${
  atendimento.prestadorId
    ? `<span class="nome-clicavel" onclick="abrirPerfilPublico(${atendimento.prestadorId})">${atendimento.nomePrestador}</span>`
    : "Aguardando prestador"
}</p>
        ${informacoesPrestador}
        ${botaoChat}
        ${statusFinalizacao}
        ${botaoFinalizar}
        ${areaAvaliacao}
      `;

      listaMeusAtendimentos.appendChild(div);
    });

  } catch (erro) {
    listaMeusAtendimentos.innerHTML = "<p>Erro ao carregar seus atendimentos.</p>";
  }
}

// =========================
// CLIENTE ABRIR CHAT
// =========================

async function abrirTelaChatCliente(id) {
  try {
    const resposta = await fetch(`${API_URL}/solicitacoes`);
    const solicitacoes = await resposta.json();

    const atendimento = solicitacoes.find((solicitacao) => {
      return solicitacao.id === id;
    });

    if (!atendimento) {
      alert("Atendimento não encontrado.");
      return;
    }

    abrirTelaChat(atendimento);

  } catch (erro) {
    alert("Erro ao abrir chat.");
  }
}

// =========================
// PRESTADOR ABRIR CHAT
// =========================

async function abrirTelaChatPrestador(id) {

  try {

    const resposta = await fetch(`${API_URL}/solicitacoes`);
    const solicitacoes = await resposta.json();

    const atendimento = solicitacoes.find((solicitacao) => {
      return solicitacao.id === id;
    });

    if (!atendimento) {

      alert("Atendimento não encontrado.");
      return;

    }

    abrirTelaChat(atendimento);

  } catch (erro) {

    alert("Erro ao abrir chat.");

  }

}

// =========================
// VOLTAR DE MEUS ATENDIMENTOS
// =========================

btnVoltarMeusAtendimentos.addEventListener("click", function () {
  telaMeusAtendimentos.classList.add("hidden");
  telaPrincipal.classList.remove("hidden");
});

// =========================
// VOLTAR DO CHAT
// =========================

btnVoltarChat.addEventListener("click", function () {
  telaChat.classList.add("hidden");

  if (intervaloChat) {
    clearInterval(intervaloChat);
    intervaloChat = null;
  }

  if (usuarioAtual.tipo === "Prestador") {
    telaPrestadorServico.classList.remove("hidden");
  } else {
    telaMeusAtendimentos.classList.remove("hidden");
    carregarMeusAtendimentos();
  }
});

// =========================
// VOLTAR DO PAINEL DO PRESTADOR
// =========================

btnVoltarPainelPrestador.addEventListener("click", function () {
  telaPrestadorServico.classList.add("hidden");
  telaPrincipal.classList.remove("hidden");
});

// =========================
// SAIR
// =========================

btnSair.addEventListener("click", function () {
  usuarioAtual = null;
  servicoSelecionado = "";
  solicitacaoAtualChat = null;

  if (intervaloChat) {
    clearInterval(intervaloChat);
    intervaloChat = null;
  }

  if (intervaloLocalizacaoPrestador) {
    clearInterval(intervaloLocalizacaoPrestador);
    intervaloLocalizacaoPrestador = null;
  }

  telaPrincipal.classList.add("hidden");
  telaSolicitacao.classList.add("hidden");
  telaPrestadorServico.classList.add("hidden");
  telaMeusAtendimentos.classList.add("hidden");
  telaChat.classList.add("hidden");
  telaPerfil.classList.add("hidden");
  telaPerfilPublico.classList.add("hidden");
  telaLogin.classList.remove("hidden");
});