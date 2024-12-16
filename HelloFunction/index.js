const { CosmosClient } = require("@azure/cosmos");

// Získání connection string z proměnné prostředí
const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;

// Inicializace CosmosClient
const cosmosClient = new CosmosClient(endpoint);

// Připojení k databázi a kontejneru
const databaseName = "edu-chat-db";
const containerName = "edu-chat-container";

let container;

async function initializeCosmos() {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
    console.log(`Connected to database: ${database.id}`);
    const { container: cont } = await database.containers.createIfNotExists({ id: containerName });
    console.log(`Connected to container: ${cont.id}`);
    container = cont;
  } catch (err) {
    console.error("Error initializing Cosmos DB:", err.message);
  }
}

// Zavolání inicializační funkce při spuštění
initializeCosmos();

module.exports = async function (context, req) {
  context.log('HTTP trigger processed a request.');

  // Příklad: Uložení dat do Cosmos DB
  try {
    if (!container) {
      throw new Error("Cosmos DB container not initialized.");
    }

    const newItem = {
      id: Date.now().toString(),
      message: "Hello from Azure Functions!!"
    };

    await container.items.create(newItem);

    context.res = {
      body: "Item saved to Cosmos DB!"
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: `Error: ${err.message}`
    };
  }
};
