// =====================================
// 💾 Configuração do Cliente Cassandra
// =====================================

require('dotenv').config();
const cassandra = require('cassandra-driver');

// Validar variáveis de ambiente obrigatórias
const requiredEnvVars = [
  'CASSANDRA_CONTACT_POINTS',
  'CASSANDRA_LOCAL_DATACENTER',
  'CASSANDRA_KEYSPACE'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Erro: Variáveis de ambiente faltando:', missingVars.join(', '));
  console.error('💡 Crie um arquivo .env baseado no .env.example');
  process.exit(1);
}

// Configuração do cliente Cassandra
const clientConfig = {
  contactPoints: process.env.CASSANDRA_CONTACT_POINTS.split(',').map(ip => ip.trim()),
  localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
};

// Adicionar timeout se configurado
if (process.env.CASSANDRA_CONNECT_TIMEOUT) {
  clientConfig.socketOptions = {
    connectTimeout: parseInt(process.env.CASSANDRA_CONNECT_TIMEOUT)
  };
}

// Criar cliente
const client = new cassandra.Client(clientConfig);

// Log de configuração (apenas em modo debug)
if (process.env.LOG_LEVEL === 'debug') {
  console.log('🔧 Configuração do Cassandra:', {
    contactPoints: clientConfig.contactPoints,
    localDataCenter: clientConfig.localDataCenter,
    keyspace: clientConfig.keyspace
  });
}

module.exports = client;