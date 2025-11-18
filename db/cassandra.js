const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['136.115.4.10'],  // depois altere para o IP do container ou VM
  localDataCenter: 'datacenter1',
  keyspace: 'filmes'
});

module.exports = client;
