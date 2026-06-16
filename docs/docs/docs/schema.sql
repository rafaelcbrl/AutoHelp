CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    idade INTEGER,
    tipo VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    bairro VARCHAR(100),
    descricao TEXT,
    foto_perfil TEXT,
    estrelas NUMERIC(3,2) DEFAULT 5.0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitacoes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nome_cliente VARCHAR(150),
    servico VARCHAR(50),
    endereco TEXT,
    veiculo VARCHAR(150),
    descricao TEXT,
    telefone VARCHAR(30),
    status VARCHAR(50),
    prestador_id BIGINT,
    nome_prestador VARCHAR(150),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_solicitacao_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
);

CREATE TABLE mensagens (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    nome_usuario VARCHAR(150),
    tipo_usuario VARCHAR(20),
    texto TEXT,
    enviada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mensagem_solicitacao
    FOREIGN KEY (solicitacao_id)
    REFERENCES solicitacoes(id),

    CONSTRAINT fk_mensagem_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
);

CREATE TABLE avaliacoes (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL,
    avaliador_id BIGINT NOT NULL,
    avaliado_id BIGINT NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_avaliacao_solicitacao
    FOREIGN KEY (solicitacao_id)
    REFERENCES solicitacoes(id),

    CONSTRAINT fk_avaliador
    FOREIGN KEY (avaliador_id)
    REFERENCES usuarios(id),

    CONSTRAINT fk_avaliado
    FOREIGN KEY (avaliado_id)
    REFERENCES usuarios(id)
);

CREATE TABLE historico_ia (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historico_ia_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
);
