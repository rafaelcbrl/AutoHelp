const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =========================
// BANCO DE DADOS TEMPORÁRIO
// =========================

let usuarios = [];
let solicitacoes = [];

// =========================
// ROTA INICIAL
// =========================

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// =========================
// CADASTRO
// =========================

app.post("/cadastro", (req, res) => {
  const { nome, idade, tipo, email, senha } = req.body;

  if (!nome || !idade || !tipo || !email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos."
    });
  }

  const usuarioExiste = usuarios.find((usuario) => usuario.email === email);

  if (usuarioExiste) {
    return res.status(409).json({
      mensagem: "Esse Gmail já está cadastrado."
    });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    idade,
    tipo,
    email,
    senha,
    telefone: "",
    bairro: "",
    descricao: "",
    fotoPerfil: "",
    estrelas: 5
  };

  usuarios.push(novoUsuario);

  res.status(201).json({
    mensagem: "Cadastro realizado com sucesso!",
    usuario: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      idade: novoUsuario.idade,
      tipo: novoUsuario.tipo,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      bairro: novoUsuario.bairro,
      descricao: novoUsuario.descricao,
      fotoPerfil: novoUsuario.fotoPerfil,
      estrelas: novoUsuario.estrelas
    }
  });
});

// =========================
// LOGIN
// =========================

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Preencha Gmail e senha."
    });
  }

  const usuarioEncontrado = usuarios.find((usuario) => {
    return usuario.email === email && usuario.senha === senha;
  });

  if (!usuarioEncontrado) {
    return res.status(401).json({
      mensagem: "Gmail ou senha incorretos."
    });
  }

  res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    usuario: {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      idade: usuarioEncontrado.idade,
      tipo: usuarioEncontrado.tipo,
      email: usuarioEncontrado.email,
      telefone: usuarioEncontrado.telefone,
      bairro: usuarioEncontrado.bairro,
      descricao: usuarioEncontrado.descricao,
      fotoPerfil: usuarioEncontrado.fotoPerfil,
      estrelas: usuarioEncontrado.estrelas
    }
  });
});

// =========================
// LISTAR USUÁRIOS SEM SENHA
// =========================

app.get("/usuarios", (req, res) => {
  const usuariosSemSenha = usuarios.map((usuario) => {
    return {
      id: usuario.id,
      nome: usuario.nome,
      idade: usuario.idade,
      tipo: usuario.tipo,
      email: usuario.email,
      telefone: usuario.telefone,
      bairro: usuario.bairro,
      descricao: usuario.descricao,
      fotoPerfil: usuario.fotoPerfil,
      estrelas: usuario.estrelas
    };
  });

  res.json(usuariosSemSenha);
});

// =========================
// BUSCAR PERFIL DO USUÁRIO
// =========================

app.get("/perfil/:id", (req, res) => {
  const { id } = req.params;

  const usuario = usuarios.find((item) => {
    return item.id === Number(id);
  });

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado."
    });
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    idade: usuario.idade,
    tipo: usuario.tipo,
    email: usuario.email,
    telefone: usuario.telefone,
    bairro: usuario.bairro,
    descricao: usuario.descricao,
    fotoPerfil: usuario.fotoPerfil,
    estrelas: usuario.estrelas
  });
});

// =========================
// ATUALIZAR PERFIL DO USUÁRIO
// =========================

app.put("/perfil/:id", (req, res) => {
  const { id } = req.params;

  const {
    nome,
    idade,
    telefone,
    bairro,
    descricao,
    fotoPerfil
  } = req.body;

  const usuario = usuarios.find((item) => {
    return item.id === Number(id);
  });

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado."
    });
  }

  if (!nome || !idade) {
    return res.status(400).json({
      mensagem: "Nome e idade são obrigatórios."
    });
  }

  usuario.nome = nome;
  usuario.idade = idade;
  usuario.telefone = telefone || "";
  usuario.bairro = bairro || "";
  usuario.descricao = descricao || "";

  if (fotoPerfil !== undefined) {
    usuario.fotoPerfil = fotoPerfil;
  }

  res.json({
    mensagem: "Perfil atualizado com sucesso!",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      idade: usuario.idade,
      tipo: usuario.tipo,
      email: usuario.email,
      telefone: usuario.telefone,
      bairro: usuario.bairro,
      descricao: usuario.descricao,
      fotoPerfil: usuario.fotoPerfil,
      estrelas: usuario.estrelas
    }
  });
});

// =========================
// CRIAR SOLICITAÇÃO DO CLIENTE
// =========================

app.post("/solicitacoes", (req, res) => {
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
    id: solicitacoes.length + 1,
    usuarioId,
    nomeCliente,
    servico,
    endereco,
    veiculo,
    descricao,
    telefone,
    latitude: latitude || null,
    longitude: longitude || null,
    latitudePrestador: null,
    longitudePrestador: null,
    compartilharMapaPrestador: false,
    ultimaAtualizacaoPrestador: null,
    status: "Aguardando prestador",
    prestadorId: null,
    nomePrestador: null,
    criadoEm: new Date().toLocaleString("pt-BR"),
    mensagens: []
  };

  solicitacoes.push(novaSolicitacao);

  res.status(201).json({
    mensagem: "Solicitação criada com sucesso!",
    solicitacao: novaSolicitacao
  });
});

// =========================
// LISTAR TODAS AS SOLICITAÇÕES
// =========================

app.get("/solicitacoes", (req, res) => {
  res.json(solicitacoes);
});

// =========================
// LISTAR SOLICITAÇÕES DISPONÍVEIS PARA PRESTADORES
// =========================

app.get("/solicitacoes-disponiveis", (req, res) => {
  const disponiveis = solicitacoes.filter((solicitacao) => {
    return solicitacao.status === "Aguardando prestador";
  });

  res.json(disponiveis);
});

// =========================
// LISTAR SOLICITAÇÕES POR SERVIÇO
// =========================

app.get("/solicitacoes/servico/:servico", (req, res) => {
  const { servico } = req.params;

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    return solicitacao.servico === servico;
  });

  res.json(solicitacoesFiltradas);
});

// =========================
// PRESTADOR ACEITAR SOLICITAÇÃO
// =========================

app.put("/solicitacoes/:id/aceitar", (req, res) => {
  const { id } = req.params;
  const { prestadorId, nomePrestador } = req.body;

  if (!prestadorId || !nomePrestador) {
    return res.status(400).json({
      mensagem: "Dados do prestador não enviados."
    });
  }

  const solicitacao = solicitacoes.find((item) => {
    return item.id === Number(id);
  });

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

  solicitacao.status = "Em atendimento";
  solicitacao.prestadorId = prestadorId;
  solicitacao.nomePrestador = nomePrestador;

  res.json({
    mensagem: "Solicitação aceita com sucesso!",
    solicitacao
  });
});

// =========================
// ATUALIZAR LOCALIZAÇÃO DO PRESTADOR
// =========================

app.put("/solicitacoes/:id/localizacao-prestador", (req, res) => {
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

  const solicitacao = solicitacoes.find((item) => {
    return item.id === Number(id);
  });

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  if (solicitacao.prestadorId !== prestadorId) {
    return res.status(403).json({
      mensagem: "Você não tem permissão para atualizar esta localização."
    });
  }

  solicitacao.latitudePrestador = latitudePrestador;
  solicitacao.longitudePrestador = longitudePrestador;
  solicitacao.compartilharMapaPrestador = compartilharMapaPrestador === true;
  solicitacao.ultimaAtualizacaoPrestador = new Date().toLocaleString("pt-BR");

  res.json({
    mensagem: "Localização do prestador atualizada com sucesso!",
    solicitacao
  });
});

// =========================
// ENVIAR MENSAGEM NO CHAT
// =========================

app.post("/solicitacoes/:id/mensagens", (req, res) => {
  const { id } = req.params;
  const { usuarioId, nomeUsuario, tipoUsuario, texto } = req.body;

  if (!usuarioId || !nomeUsuario || !tipoUsuario || !texto) {
    return res.status(400).json({
      mensagem: "Dados da mensagem incompletos."
    });
  }

  const solicitacao = solicitacoes.find((item) => {
    return item.id === Number(id);
  });

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  const novaMensagem = {
    id: solicitacao.mensagens.length + 1,
    usuarioId,
    nomeUsuario,
    tipoUsuario,
    texto,
    enviadaEm: new Date().toLocaleString("pt-BR")
  };

  solicitacao.mensagens.push(novaMensagem);

  res.status(201).json({
    mensagem: "Mensagem enviada com sucesso!",
    mensagens: solicitacao.mensagens
  });
});

// =========================
// LISTAR MENSAGENS DO CHAT
// =========================

app.get("/solicitacoes/:id/mensagens", (req, res) => {
  const { id } = req.params;

  const solicitacao = solicitacoes.find((item) => {
    return item.id === Number(id);
  });

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  res.json(solicitacao.mensagens);
});

// =========================
// FINALIZAR SOLICITAÇÃO
// =========================

app.put("/solicitacoes/:id/finalizar", (req, res) => {
  const { id } = req.params;

  const solicitacao = solicitacoes.find((item) => {
    return item.id === Number(id);
  });

  if (!solicitacao) {
    return res.status(404).json({
      mensagem: "Solicitação não encontrada."
    });
  }

  solicitacao.status = "Finalizado";

  res.json({
    mensagem: "Solicitação finalizada com sucesso!",
    solicitacao
  });
});

// =========================
// INICIAR SERVIDOR
// =========================

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});