# 🎬 Avaliação de Filmes - Cassandra

Projeto de avaliação de filmes usando Node.js, Express e Apache Cassandra.

## 📋 Funcionalidades

- ✅ Cadastrar novos filmes (título, ano, gênero)
- ✅ Listar todos os filmes cadastrados
- ✅ Avaliar filmes com notas de 0 a 10
- ✅ Visualizar todas as avaliações de um filme
- ✅ Calcular média de avaliações automaticamente

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: Apache Cassandra 5.0
- **Frontend**: HTML5 + Bootstrap 5 + JavaScript

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- Apache Cassandra (versão 5.0 ou superior)
- npm ou yarn

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd FilmesCassandra
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as variáveis conforme seu ambiente:

```env
# Porta do servidor Node.js
PORT=3000

# Configurações do Cassandra
CASSANDRA_CONTACT_POINTS=127.0.0.1
CASSANDRA_PORT=9042
CASSANDRA_LOCAL_DATACENTER=datacenter1
CASSANDRA_KEYSPACE=filmes

# Timeout de conexão (em ms)
CASSANDRA_CONNECT_TIMEOUT=30000

# Ambiente
NODE_ENV=development

# Log level (debug, info, warn, error)
LOG_LEVEL=info
```

**Para descobrir o IP do container Docker:**

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cassandra
```

Atualize `CASSANDRA_CONTACT_POINTS` no `.env` com o IP retornado.

### 4. Configurar o Cassandra

#### Opção A: Usando Docker (recomendado)

```bash
# Criar rede
docker network create cassandra-net

# Iniciar container Cassandra
docker run -d --name cassandra \
  --hostname cassandra_1 \
  --network cassandra-net \
  -p 9042:9042 \
  cassandra:latest

# Aguardar inicialização (pode demorar 1-2 minutos)
docker logs -f cassandra
```

#### Opção B: Cassandra local

Se você já tem o Cassandra instalado localmente, apenas inicie o serviço:

```bash
cassandra -f
```

### 5. Criar o banco de dados

Execute o script SQL no cqlsh:

```bash
# Entrar no cqlsh
docker exec -it cassandra cqlsh

# Ou se estiver rodando localmente:
cqlsh
```

Depois copie e cole os comandos do arquivo `init.cql` ou execute diretamente:

```sql
CREATE KEYSPACE IF NOT EXISTS filmes
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE filmes;

CREATE TABLE IF NOT EXISTS catalogo (
    id UUID PRIMARY KEY,
    titulo TEXT,
    ano INT,
    genero TEXT
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id UUID PRIMARY KEY,
    id_filme UUID,
    nota INT,
    data TIMESTAMP
);

CREATE INDEX IF NOT EXISTS avaliacao_id_filme_idx ON avaliacao (id_filme);
```

### 6. Testar a conexão

```bash
npm run test
# ou
node testConnect.js
```

Se aparecer "✅ Conectado ao Cassandra com sucesso!", está tudo certo!

## ▶️ Executando o projeto

```bash
npm start
# ou
node index.js

# Para desenvolvimento com auto-reload:
npm run dev
```

Acesse no navegador: `http://localhost:3000`

## 📡 Endpoints da API

### Filmes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/filmes` | Lista todos os filmes |
| POST | `/filmes` | Cadastra um novo filme |

**Exemplo de cadastro de filme:**
```json
{
  "titulo": "Matrix",
  "ano": 1999,
  "genero": "Ficção Científica"
}
```

### Avaliações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/avaliacoes` | Lista todas as avaliações |
| GET | `/avaliacoes/:id_filme` | Lista avaliações de um filme |
| POST | `/avaliacoes` | Cadastra uma nova avaliação |

**Exemplo de avaliação:**
```json
{
  "id_filme": "uuid-do-filme",
  "nota": 9
}
```

## 🧪 Testando a API com curl

```bash
# Listar filmes
curl http://localhost:3000/filmes

# Adicionar filme
curl -X POST http://localhost:3000/filmes \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Inception","ano":2010,"genero":"Ficção"}'

# Adicionar avaliação
curl -X POST http://localhost:3000/avaliacoes \
  -H "Content-Type: application/json" \
  -d '{"id_filme":"seu-uuid-aqui","nota":10}'
```

## 📊 Estrutura do Banco de Dados

### Keyspace: `filmes`
- **Replication Strategy**: SimpleStrategy
- **Replication Factor**: 1

### Tabela: `catalogo`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| titulo | TEXT | Nome do filme |
| ano | INT | Ano de lançamento |
| genero | TEXT | Gênero do filme |

### Tabela: `avaliacao`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| id_filme | UUID | Referência ao filme |
| nota | INT | Nota de 0 a 10 |
| data | TIMESTAMP | Data da avaliação |

## 🐛 Troubleshooting

### Erro de conexão com Cassandra

1. Verifique se o Cassandra está rodando:
   ```bash
   docker ps
   # ou
   nodetool status
   ```

2. Confirme o IP correto no arquivo `db/cassandra.js`

3. Teste a conexão manualmente:
   ```bash
   cqlsh <IP_DO_CASSANDRA> 9042
   ```

### Erro "Keyspace filmes does not exist"

Execute os comandos SQL do arquivo `init.cql` no cqlsh.

### Porta 3000 já em uso

Altere a porta no `index.js`:
```javascript
const PORT = 3001; // ou outra porta disponível
```

## 📝 Requisitos do Exercício

- [x] Criar keyspace **bolsa_de_valores** (adaptado para **filmes**)
- [x] Criar tabelas com chaves primárias apropriadas
- [x] Implementar backend em Node.js
- [x] Criar endpoints para listar, cadastrar e consultar
- [x] Interface web funcional
- [x] Consultas por ID funcionando corretamente

## 🎓 Exercício Concluído

Este projeto atende todos os requisitos do exercício final do `cassandra.md`:
1. ✅ Modelagem de banco de dados Cassandra
2. ✅ Criação de keyspace e tabelas
3. ✅ Backend Node.js com Express
4. ✅ Integração com Cassandra via driver oficial
5. ✅ Frontend funcional com Bootstrap
6. ✅ CRUD completo de filmes e avaliações

## 👨‍💻 Autor

Desenvolvido como exercício final do curso de NoSQL - Cassandra.

## 📄 Licença

MIT