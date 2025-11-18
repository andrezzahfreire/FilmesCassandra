const client = require('./db/cassandra');

client.connect()
  .then(() => console.log('✅ Conectado ao Cassandra remoto!'))
  .catch(err => console.error('❌ Erro de conexão:', err))
  .finally(() => client.shutdown());
