# Modelagem NoSQL – AutoHelp

## 1. Modelagem MongoDB

Embora o AutoHelp utilize Supabase/PostgreSQL como banco principal, uma estrutura NoSQL poderia ser utilizada para armazenar conversas do chat e histórico de interações em formato de documento.

### Coleção: conversas

```json
{
  "_id": "conv_001",
  "solicitacaoId": 1,
  "cliente": {
    "id": 1,
    "nome": "Rafael Cabral"
  },
  "prestador": {
    "id": 2,
    "nome": "Carlos Mecânico"
  },
  "servico": "Mecânico",
  "status": "Em atendimento",
  "mensagens": [
    {
      "usuarioId": 1,
      "nomeUsuario": "Rafael Cabral",
      "tipoUsuario": "Cliente",
      "texto": "Meu carro não está ligando.",
      "enviadaEm": "2026-06-16T10:00:00"
    },
    {
      "usuarioId": 2,
      "nomeUsuario": "Carlos Mecânico",
      "tipoUsuario": "Prestador",
      "texto": "Estou indo até o local.",
      "enviadaEm": "2026-06-16T10:02:00"

Justificativa

O MongoDB é adequado para armazenar conversas porque permite guardar mensagens em formato de documento, facilitando a consulta do histórico completo de um atendimento em uma única estrutura.

2. Modelagem Redis

O Redis poderia ser utilizado para armazenar informações temporárias e de acesso rápido, como disponibilidade de prestadores e localização recente durante um atendimento.

prestador:2:status
{
  "prestadorId": "2",
  "nome": "Carlos Mecânico",
  "disponibilidade": "Disponível",
  "latitude": "-23.5505",
  "longitude": "-46.6333",
  "ultimaAtualizacao": "2026-06-16T10:05:00"
}

Caso de uso

O Redis pode ser usado para consultar rapidamente quais prestadores estão disponíveis e próximos do cliente, sem precisar buscar constantemente essas informações no banco relacional.

Benefícios
Alta velocidade de leitura e escrita.
Ideal para dados temporários.
Útil para localização em tempo real.
Reduz carga sobre o banco principal.
    }
  ]
