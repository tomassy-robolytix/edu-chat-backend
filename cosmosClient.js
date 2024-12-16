const { CosmosClient } = require('@azure/cosmos');

// COSMOS_DB_CONNECTION_STRING máš nastavené v Azure Configuration
const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database('EduChatDB');  // přizpůsob podle jména DB, co jsi vytvořil
const container = database.container('UserProgress'); // přizpůsob kontejner

module.exports = { container };
