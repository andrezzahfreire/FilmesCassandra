// =====================================
// 🎬 Projeto: Avaliação de Filmes
// Backend Node.js + Express + Cassandra
// =====================================

const express = require('express');
const cassandra = require('cassandra-driver');
const path = require('path');
const app = express();

// Middleware necessário para ler JSON
app.use(express.json());

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// =====================================
// 💾 Conexão com o Cassandra
// =====================================
const client = new cassandra.Client({
  contactPoints: ['136.115.4.10'], // se estiver em VM, troque pelo IP da VM GCP
  localDataCenter: 'datacenter1',
  keyspace: 'filmes'
});

// Teste de conexão
client.connect()
  .then(() => console.log('✅ Conectado ao Cassandra!'))
  .catch(err => console.error('❌ Erro ao conectar ao Cassandra:', err));

// =====================================
// 🏠 Rota raiz
// =====================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================================
// 🎥 Rotas de FILMES
// =====================================

// Cadastrar novo filme
app.post('/filmes', async (req, res) => {
  try {
    const { titulo, ano, genero } = req.body;

    if (!titulo) {
      return res.status(400).send("Campo 'titulo' é obrigatório!");
    }

    await client.execute(
      'INSERT INTO catalogo (id, titulo, ano, genero) VALUES (uuid(), ?, ?, ?)',
      [titulo, ano || null, genero || null],
      { prepare: true }
    );

    console.log(`🎬 Novo filme cadastrado: ${titulo}`);
    res.send('Filme cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao cadastrar filme:', err);
    res.status(500).send('Erro ao cadastrar filme.');
  }
});

// Listar filmes
app.get('/filmes', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM catalogo');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).send('Erro ao buscar filmes.');
  }
});

// =====================================
// ⭐ Rotas de AVALIAÇÕES
// =====================================

// Cadastrar nova avaliação
app.post('/avaliacoes', async (req, res) => {
  try {
    const { id_filme, nota } = req.body;

    if (!id_filme || typeof nota === 'undefined') {
      return res.status(400).send("Campos 'id_filme' e 'nota' são obrigatórios!");
    }

    await client.execute(
      'INSERT INTO avaliacao (id, id_filme, nota, data) VALUES (uuid(), ?, ?, toTimestamp(now()))',
      [id_filme, nota],
      { prepare: true }
    );

    console.log(`⭐ Nova avaliação registrada (filme ${id_filme} - nota ${nota})`);
    res.send('Avaliação registrada!');
  } catch (err) {
    console.error('Erro ao registrar avaliação:', err);
    res.status(500).send('Erro ao registrar avaliação.');
  }
});

// Listar avaliações
app.get('/avaliacoes', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM avaliacao');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err);
    res.status(500).send('Erro ao buscar avaliações.');
  }
});

// =====================================
// 🚀 Inicialização do servidor
// =====================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
