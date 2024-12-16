const { CosmosClient } = require("@azure/cosmos");

// Získání connection string z proměnného prostředí
const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;

// Inicializace CosmosClient
const cosmosClient = new CosmosClient(endpoint);

// Připojení k databázi a kontejneru
const databaseName = "EduChatDB";
const containerName = "UserProgress";

module.exports = async function (context, req) {
  try {
    // Získání reference na databázi a kontejner
    const database = cosmosClient.database(databaseName);
    const container = database.container(containerName);

    // Provedení dotazu (například SELECT * FROM c)
    const { resources: items } = await container.items
      .query("SELECT * FROM c")
      .fetchAll();

    context.log("Data successfully fetched from Cosmos DB");

    // Odpověď na HTTP požadavek
    context.res = {
      status: 200,
      body: items,
    };
  } catch (err) {
    context.log.error("Error occurred while fetching data from Cosmos DB:", err);
    context.res = {
      status: 500,
      body: "Internal Server Error. Check function logs for details.",
    };
  }
};
