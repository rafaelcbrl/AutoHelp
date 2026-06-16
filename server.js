const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = "https://oljcypdcjvdmahzetcvi.supabase.co";
const SUPABASE_KEY = "sb_publishable_AAxZmtte5ig41GopErOwNQ_FGm-Gsmj";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =========================
// FUNÇÕES AUXILIARES
// =========================

function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    idade: usuario.idade,
    tipo: usuario.tipo,
    email: usuario.email,
    telefone: usuario.telefone || "",
    bairro: usuario.bairro || "",
    descricao: usuario.descricao || "",
    fotoPerfil: usuario.fotoPerfil || "",
    estrelas: usuario.estrelas || 5,
    totalAvaliacoes: usuario.totalAvaliacoes || 0,
    somaAvaliacoes: usuario.somaAvaliacoes || 0,
    avaliacoesRecebidas: usuario.avaliacoesRecebidas || []
  };
}

function formatarSolicitacao(solicitacao) {
  return {
    id: solicitacao.id,
    usuarioId: solicitacao.usuarioId,
    nomeCliente: solicitacao.nomeCliente,
    servico: solicitacao.servico,
    endereco: solicitacao.endereco,
    veiculo: solicitacao.veiculo,
    descricao: solicitacao.descricao,
    telefone: solicitacao.telefone,
    latitude: solicitacao.latitude,
    longitude: solicitacao.longitude,
    latitudePrestador: solicitacao.latitudePrestador,
    longitudePrestador: solicitacao.longitudePrestador,
    compartilharMapaPrestador: solicitacao.compartilharMapaPrestador || false,
    ultimaAtualizacaoPrestador: solicitacao.ultimaAtualizacaoPrestador,
    status: solicitacao.status,
    prestadorId: solicitacao.prestadorId,
    nomePrestador: solicitacao.nomePrestador,
    criadoEm: solicitacao.criadoEm || solicitacao.created_at,
    mensagens: solicitacao.mensagens || [],
    avaliacaoCliente: solicitacao.avaliacaoCliente || false,
    avaliacaoPrestador: solicitacao.avaliacaoPrestador || false,
    clienteConfirmouFinalizacao: solicitacao.clienteConfirmouFinalizacao || false,
    prestadorConfirmouFinalizacao: solicitacao.prestadorConfirmouFinalizacao || false
  };
}

async function buscarSolicitacaoPorId(id) {
  const { data, error } = await supabase
    .from("solicitacoes")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function buscarUsuarioPorId(id) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    return null;
  }

  return data;
}

// =========================
// ROTA INICIAL
// =========================

app.get("/", (req, res) => {
  res.send("Servidor rodando com Supabase!");
});

// =========================
// CADASTRO
// =========================

app.post("/cadastro", async (req, res) => {
  const { nome, idade, tipo, email, senha } = req.body;

  if (!nome || !idade || !tipo || !email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos."
    });
  }

  const { data: usuarioExiste, error: erroBusca } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (erroBusca) {
    return res.status(500).json({
      mensagem: "Erro ao verificar Gmail."
    });
  }

  if (usuarioExiste) {
    return res.status(409).json({
      mensagem: "Esse Gmail já está cadastrado."
    });
  }

  const novoUsuario = {
    nome,
    idade: Number(idade),
    tipo,
    email,
    senha,
    telefone: "",
    bairro: "",
    descricao: "",
    fotoPerfil: "",
    estrelas: 5,
    totalAvaliacoes: 0,
    somaAvaliacoes: 0,
    avaliacoesRecebidas: []
  };

  const { data, error } = await supabase
    .from("usuarios")
    .insert([novoUsuario])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
      erro: error.message
    });
  }

  res.status(201).json({
    mensagem: "Cadastro realizado com sucesso!",
    usuario: formatarUsuario(data)
  });
});

// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha Gmail e senha."
    });
  }

  const { data: usuarioEncontrado, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao fazer login."
    });
  }

  if (!usuarioEncontrado) {
    return res.status(401).json({
      mensagem: "Gmail ou senha incorretos."
    });
  }

  res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    usuario: formatarUsuario(usuarioEncontrado)
  });
});

// =========================
// LISTAR USUÁRIOS SEM SENHA
// =========================

app.get("/usuarios", async (req, res) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar usuários."
    });
  }

  const usuariosSemSenha = data.map((usuario) => formatarUsuario(usuario));

  res.json(usuariosSemSenha);
});

// =========================
// BUSCAR PERFIL DO USUÁRIO
// =========================

app.get("/perfil/:id", async (req, res) => {
  const { id } = req.params;

  const usuario = await buscarUsuarioPorId(id);

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado."
    });
  }

  res.json(formatarUsuario(usuario));
});

// =========================
// ATUALIZAR PERFIL DO USUÁRIO
// =========================

app.put("/perfil/:id", async (req, res) => {
  const { id } = req.params;

  const {
    nome,
    idade,
    telefone,
    bairro,
    descricao,
    fotoPerfil
  } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({
      mensagem: "Nome e idade são obrigatórios."
    });
  }

  const usuario = await buscarUsuarioPorId(id);

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado."
    });
  }

  const dadosAtualizados = {
    nome,
    idade: Number(idade),
    telefone: telefone || "",
    bairro: bairro || "",
    descricao: descricao || ""
  };

  if (fotoPerfil !== undefined) {
    dadosAtualizados.fotoPerfil = fotoPerfil;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .update(dadosAtualizados)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar perfil.",
      erro: error.message
    });
  }

  res.json({
    mensagem: "Perfil atualizado com sucesso!",
    usuario: formatarUsuario(data)
  });
});

// =========================
// CRIAR SOLICITAÇÃO DO CLIENTE
// =========================

app.post("/solicitacoes", async (req, res) => {
  const {
    usuarioId,
    nomeCliente,
    servico,
    endereco,
    veiculo,
    descricao,
    telefone,
    latitude,
    longitude
  } = req.body;

  if (
    !usuarioId ||
    !nomeCliente ||
    !servico ||
    !endereco ||
    !veiculo ||
    !descricao ||
    !telefone
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos da solicitação."
    });
  }

  const servicosPermitidos = ["Entrega", "Mecânico", "Guincho"];

  if (!servicosPermitidos.includes(servico)) {
    return res.status(400).json({
      mensagem: "Serviço inválido."
    });
  }

  const novaSolicitacao = {
    usuarioId: Number(usuarioId),
    nomeCliente,
    servico,
    endereco,
    veiculo,
    descricao,
    telefone,
    latitude: latitude ? Number(latitude) : null,
    longitude: longitude ? Number(longitude) : null,
    latitudePrestador: null,
    longitudePrestador: null,
    compartilharMapaPrestador: false,
    ultimaAtualizacaoPrestador: null,
    status: "Aguardando prestador",
    prestadorId: null,
    nomePrestador: null,
    mensagens: [],
    avaliacaoCliente: false,
    avaliacaoPrestador: false,
    clienteConfirmouFinalizacao: false,
    prestadorConfirmouFinalizacao: false
  };

  const { data, error } = await supabase
    .from("solicitacoes")
    .insert([novaSolicitacao])
    .select()
    .single();

  if (error) {
  console.log("Erro Supabase ao criar solicitação:", error);

  return res.status(500).json({
    mensagem: "Erro ao criar solicitação.",
    erro: error.message
    });
  }

  res.status(201).json({
    mensagem: "Solicitação criada com sucesso!",
    solicitacao: formatarSolicitacao(data)
  });
});

// =========================
// LISTAR TODAS AS SOLICITAÇÕES
// =========================

app.get("/solicitacoes", async (req, res) => {
  const { data, error } = await supabase
    .from("solicitacoes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar solicitações."
    });
  }

  res.json(data.map((solicitacao) => formatarSolicitacao(solicitacao)));
});

// =========================
// LISTAR SOLICITAÇÕES DISPONÍVEIS PARA PRESTADORES
// =========================

app.get("/solicitacoes-disponiveis", async (req, res) => {
  const { data, error } = await supabase
    .from("solicitacoes")
    .select("*")
    .eq("status", "Aguardando prestador")
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar solicitações disponíveis."
    });
  }

  res.json(data.map((solicitacao) => formatarSolicitacao(solicitacao)));
});

// =========================
// LISTAR SOLICITAÇÕES POR SERVIÇO
// =========================

app.get("/solicitacoes/servico/:servico", async (req, res) => {
  const { servico } = req.params;

  const { data, error } = await supabase
    .from("solicitacoes")
    .select("*")
    .eq("servico", servico)
    .order("id", { ascending: true });

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar solicitações por serviço."
    });
  }

  res.json(data.map((solicitacao) => formatarSolicitacao(solicitacao)));
});

// =========================
// PRESTADOR ACEITAR SOLICITAÇÃO
// =========================

app.put("/solicitacoes/:id/aceitar", async (req, res) => {
  const { id } = req.params;
  const { prestadorId, nomePrestador } = req.body;

  if (!prestadorId || !nomePrestador) {
    return res.status(400).json({
      mensagem: "Dados do prestador não enviados."
    });
  }

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  if (solicitacao.status !== "Aguardando prestador") {
    return res.status(400).json({
      mensagem: "Essa solicitação já foi aceita."
    });
  }

  const { data, error } = await supabase
    .from("solicitacoes")
    .update({
      status: "Em atendimento",
      prestadorId: Number(prestadorId),
      nomePrestador
    })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao aceitar solicitação."
    });
  }

  res.json({
    mensagem: "Solicitação aceita com sucesso!",
    solicitacao: formatarSolicitacao(data)
  });
});

// =========================
// ATUALIZAR LOCALIZAÇÃO DO PRESTADOR
// =========================

app.put("/solicitacoes/:id/localizacao-prestador", async (req, res) => {
  const { id } = req.params;

  const {
    prestadorId,
    latitudePrestador,
    longitudePrestador,
    compartilharMapaPrestador
  } = req.body;

  if (!prestadorId || !latitudePrestador || !longitudePrestador) {
    return res.status(400).json({
      mensagem: "Dados de localização incompletos."
    });
  }

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  if (solicitacao.prestadorId !== Number(prestadorId)) {
    return res.status(403).json({
      mensagem: "Você não tem permissão para atualizar esta localização."
    });
  }

  const { data, error } = await supabase
    .from("solicitacoes")
    .update({
      latitudePrestador: Number(latitudePrestador),
      longitudePrestador: Number(longitudePrestador),
      compartilharMapaPrestador: compartilharMapaPrestador === true,
      ultimaAtualizacaoPrestador: new Date().toLocaleString("pt-BR")
    })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar localização do prestador."
    });
  }

  res.json({
    mensagem: "Localização do prestador atualizada com sucesso!",
    solicitacao: formatarSolicitacao(data)
  });
});

// =========================
// ENVIAR MENSAGEM NO CHAT
// =========================

app.post("/solicitacoes/:id/mensagens", async (req, res) => {
  const { id } = req.params;
  const { usuarioId, nomeUsuario, tipoUsuario, texto } = req.body;

  if (!usuarioId || !nomeUsuario || !tipoUsuario || !texto) {
    return res.status(400).json({
      mensagem: "Dados da mensagem incompletos."
    });
  }

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  const mensagensAtuais = solicitacao.mensagens || [];

  const novaMensagem = {
    id: mensagensAtuais.length + 1,
    usuarioId: Number(usuarioId),
    nomeUsuario,
    tipoUsuario,
    texto,
    enviadaEm: new Date().toLocaleString("pt-BR")
  };

  const novasMensagens = [...mensagensAtuais, novaMensagem];

  const { error } = await supabase
    .from("solicitacoes")
    .update({
      mensagens: novasMensagens
    })
    .eq("id", Number(id));

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao enviar mensagem."
    });
  }

  res.status(201).json({
    mensagem: "Mensagem enviada com sucesso!",
    mensagens: novasMensagens
  });
});

// =========================
// LISTAR MENSAGENS DO CHAT
// =========================

app.get("/solicitacoes/:id/mensagens", async (req, res) => {
  const { id } = req.params;

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  res.json(solicitacao.mensagens || []);
});

// =========================
// AVALIAR USUÁRIO
// =========================

app.put("/solicitacoes/:id/avaliar", async (req, res) => {
  const { id } = req.params;

  const {
    avaliadorId,
    avaliadoId,
    estrelas,
    comentario
  } = req.body;

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  if (solicitacao.status !== "Finalizado") {
    return res.status(400).json({
      mensagem: "Só é possível avaliar após finalizar o atendimento."
    });
  }

  if (!avaliadorId || !avaliadoId || !estrelas) {
    return res.status(400).json({
      mensagem: "Dados da avaliação incompletos."
    });
  }

  if (Number(estrelas) < 1 || Number(estrelas) > 5) {
    return res.status(400).json({
      mensagem: "A avaliação deve ser entre 1 e 5 estrelas."
    });
  }

  const usuarioAvaliado = await buscarUsuarioPorId(avaliadoId);
  const usuarioAvaliador = await buscarUsuarioPorId(avaliadorId);

  if (!usuarioAvaliado || !usuarioAvaliador) {
    return res.status(404).json({
      mensagem: "Usuário da avaliação não encontrado."
    });
  }

  if (
    solicitacao.usuarioId !== Number(avaliadorId) &&
    solicitacao.prestadorId !== Number(avaliadorId)
  ) {
    return res.status(403).json({
      mensagem: "Você não pode avaliar este atendimento."
    });
  }

  if (
    solicitacao.usuarioId !== Number(avaliadoId) &&
    solicitacao.prestadorId !== Number(avaliadoId)
  ) {
    return res.status(403).json({
      mensagem: "O usuário avaliado não pertence a este atendimento."
    });
  }

  if (Number(avaliadorId) === Number(avaliadoId)) {
    return res.status(400).json({
      mensagem: "Você não pode avaliar a si mesmo."
    });
  }

  const avaliadorEhCliente = Number(avaliadorId) === solicitacao.usuarioId;
  const avaliadorEhPrestador = Number(avaliadorId) === solicitacao.prestadorId;

  if (avaliadorEhCliente && solicitacao.avaliacaoCliente) {
    return res.status(400).json({
      mensagem: "O cliente já avaliou este atendimento."
    });
  }

  if (avaliadorEhPrestador && solicitacao.avaliacaoPrestador) {
    return res.status(400).json({
      mensagem: "O prestador já avaliou este atendimento."
    });
  }

  const novaAvaliacaoRecebida = {
    atendimentoId: solicitacao.id,
    avaliadorId: Number(avaliadorId),
    nomeAvaliador: usuarioAvaliador.nome,
    estrelas: Number(estrelas),
    comentario: comentario || "",
    criadaEm: new Date().toLocaleString("pt-BR")
  };

  const totalAvaliacoesAtual = Number(usuarioAvaliado.totalAvaliacoes || 0);
  const somaAvaliacoesAtual = Number(usuarioAvaliado.somaAvaliacoes || 0);

  const novoTotalAvaliacoes = totalAvaliacoesAtual + 1;
  const novaSomaAvaliacoes = somaAvaliacoesAtual + Number(estrelas);
  const novaMedia = novaSomaAvaliacoes / novoTotalAvaliacoes;

  const novasAvaliacoesRecebidas = [
    ...(usuarioAvaliado.avaliacoesRecebidas || []),
    novaAvaliacaoRecebida
  ];

  const { data: usuarioAtualizado, error: erroUsuario } = await supabase
    .from("usuarios")
    .update({
      totalAvaliacoes: novoTotalAvaliacoes,
      somaAvaliacoes: novaSomaAvaliacoes,
      estrelas: novaMedia,
      avaliacoesRecebidas: novasAvaliacoesRecebidas
    })
    .eq("id", Number(avaliadoId))
    .select()
    .single();

  if (erroUsuario) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar avaliação do usuário.",
      erro: erroUsuario.message
    });
  }

  await supabase
    .from("avaliacoes")
    .insert([{
      solicitacaoId: Number(id),
      avaliadorId: Number(avaliadorId),
      avaliadorNome: usuarioAvaliador.nome,
      avaliadoId: Number(avaliadoId),
      avaliadoNome: usuarioAvaliado.nome,
      estrelas: Number(estrelas),
      comentario: comentario || "",
      tipoAvaliador: usuarioAvaliador.tipo
    }]);

  const dadosAtualizacaoSolicitacao = {};

  if (avaliadorEhCliente) {
    dadosAtualizacaoSolicitacao.avaliacaoCliente = true;
  }

  if (avaliadorEhPrestador) {
    dadosAtualizacaoSolicitacao.avaliacaoPrestador = true;
  }

  const { data: solicitacaoAtualizada, error: erroSolicitacao } = await supabase
    .from("solicitacoes")
    .update(dadosAtualizacaoSolicitacao)
    .eq("id", Number(id))
    .select()
    .single();

  if (erroSolicitacao) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar avaliação da solicitação.",
      erro: erroSolicitacao.message
    });
  }

  res.json({
    mensagem: "Avaliação registrada com sucesso!",
    usuarioAvaliado: formatarUsuario(usuarioAtualizado),
    solicitacao: formatarSolicitacao(solicitacaoAtualizada)
  });
});

// =========================
// CONFIRMAR FINALIZAÇÃO DA SOLICITAÇÃO
// =========================

app.put("/solicitacoes/:id/finalizar", async (req, res) => {
  const { id } = req.params;
  const { usuarioId, tipoUsuario } = req.body;

  if (!usuarioId || !tipoUsuario) {
    return res.status(400).json({
      mensagem: "Dados do usuário não enviados para finalizar."
    });
  }

  const solicitacao = await buscarSolicitacaoPorId(id);

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  if (solicitacao.status === "Finalizado") {
    return res.status(400).json({
      mensagem: "Esse atendimento já foi finalizado."
    });
  }

  if (solicitacao.status !== "Em atendimento") {
    return res.status(400).json({
      mensagem: "Só é possível finalizar um atendimento em andamento."
    });
  }

  const dadosAtualizacao = {};

  if (tipoUsuario === "Cliente") {
    if (solicitacao.usuarioId !== Number(usuarioId)) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para finalizar este atendimento."
      });
    }

    dadosAtualizacao.clienteConfirmouFinalizacao = true;
  }

  if (tipoUsuario === "Prestador") {
    if (solicitacao.prestadorId !== Number(usuarioId)) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para finalizar este atendimento."
      });
    }

    dadosAtualizacao.prestadorConfirmouFinalizacao = true;
  }

  const clienteConfirmou =
    tipoUsuario === "Cliente"
      ? true
      : solicitacao.clienteConfirmouFinalizacao;

  const prestadorConfirmou =
    tipoUsuario === "Prestador"
      ? true
      : solicitacao.prestadorConfirmouFinalizacao;

  if (clienteConfirmou && prestadorConfirmou) {
    dadosAtualizacao.status = "Finalizado";
  }

  const { data, error } = await supabase
    .from("solicitacoes")
    .update(dadosAtualizacao)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao finalizar atendimento.",
      erro: error.message
    });
  }

  if (data.status === "Finalizado") {
    return res.json({
      mensagem: "Atendimento finalizado com sucesso! Cliente e prestador confirmaram.",
      solicitacao: formatarSolicitacao(data)
    });
  }

  res.json({
    mensagem: "Sua confirmação foi registrada. Aguardando a outra pessoa confirmar.",
    solicitacao: formatarSolicitacao(data)
  });
});

// =========================
// IA AUTOMOTIVA COM GEMINI
// =========================

app.post("/ia/perguntar", async (req, res) => {
  const {
    usuarioId,
    nomeUsuario,
    pergunta
  } = req.body;

  if (!usuarioId || !pergunta) {
    return res.status(400).json({
      mensagem: "Digite uma pergunta para a IA."
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      mensagem: "Chave da API Gemini não configurada no servidor."
    });
  }

  try {
    const prompt = `
Você é a IA Automotiva do AutoHelp, um sistema de assistência veicular.

Responda sempre em português do Brasil.

Sua função é ajudar usuários com dúvidas sobre carros, motos, guincho, panes, manutenção, sintomas mecânicos, elétrica automotiva, bateria, motor, freios, suspensão, arrefecimento, óleo, pneus, câmbio, embreagem, injeção eletrônica, scanner, combustível, ruídos, fumaça, superaquecimento e segurança veicular.

Responda com:
1. Possíveis causas
2. O que o usuário pode verificar com segurança
3. Quando deve chamar um mecânico/guincho
4. Um alerta de segurança, se houver risco

Não invente certeza absoluta. Use termos como "pode ser", "possíveis causas" e "o ideal é verificar".

Se o problema envolver freio, fumaça, cheiro de queimado, superaquecimento, vazamento grande de combustível, pane em movimento ou risco de acidente, oriente a não continuar dirigindo.

Pergunta do usuário:
${pergunta}
`;

    const resultado = await model.generateContent(prompt);
    const resposta = resultado.response.text();

    let categoria = "Geral";

    const texto = pergunta.toLowerCase();

    if (texto.includes("bateria") || texto.includes("alternador")) {
      categoria = "Elétrica / Bateria";
    } else if (texto.includes("freio")) {
      categoria = "Freios";
    } else if (texto.includes("motor") || texto.includes("injeção") || texto.includes("injecao")) {
      categoria = "Motor / Injeção";
    } else if (texto.includes("pneu")) {
      categoria = "Pneus";
    } else if (texto.includes("óleo") || texto.includes("oleo")) {
      categoria = "Óleo / Lubrificação";
    } else if (texto.includes("câmbio") || texto.includes("cambio") || texto.includes("embreagem")) {
      categoria = "Transmissão";
    } else if (texto.includes("esquentando") || texto.includes("superaquec")) {
      categoria = "Arrefecimento";
    } else if (texto.includes("guincho")) {
      categoria = "Guincho";
    }

    await supabase
      .from("historico_ia")
      .insert([{
        usuarioId: Number(usuarioId),
        nomeUsuario: nomeUsuario || "Usuário",
        pergunta,
        resposta,
        categoria
      }]);

    res.json({
      mensagem: "Resposta gerada com sucesso!",
      resposta,
      categoria
    });

  } catch (erro) {
    console.log("Erro na IA Gemini:", erro);

    res.status(500).json({
      mensagem: "Erro ao consultar a IA.",
      erro: erro.message
    });
  }
});

// =========================
// HISTÓRICO DA IA
// =========================

app.post("/ia/historico", async (req, res) => {
  const {
    usuarioId,
    nomeUsuario,
    pergunta,
    resposta,
    categoria
  } = req.body;

  if (!usuarioId || !pergunta || !resposta) {
    return res.status(400).json({
      mensagem: "Dados incompletos."
    });
  }

  const { data, error } = await supabase
    .from("historico_ia")
    .insert([{
      usuarioId: Number(usuarioId),
      nomeUsuario,
      pergunta,
      resposta,
      categoria
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao salvar histórico da IA.",
      erro: error.message
    });
  }

  res.status(201).json({
    mensagem: "Histórico salvo com sucesso!",
    historico: data
  });
});

app.get("/ia/historico/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  const { data, error } = await supabase
    .from("historico_ia")
    .select("*")
    .eq("usuarioId", Number(usuarioId))
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar histórico."
    });
  }

  res.json(data);
});

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});