const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log("Testing connection to Cosmos DB...");

    try {
        // Získání connection string
        const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
        context.log("Connection String:", endpoint); // Loguje connection string pro kontrolu
        if (!endpoint) throw new Error("COSMOS_DB_CONNECTION_STRING is missing.");

        // Inicializace klienta
        const cosmosClient = new CosmosClient(endpoint);

        // Ověření databáze a kontejneru
        const databaseName = "edu-chat-db";
        const containerName = "edu-chat-container";

        context.log(`Connecting to database: ${databaseName}, container: ${containerName}`);
        const container = cosmosClient.database(databaseName).container(containerName);

        // Test čtení dat
        context.log("Fetching data...");
        const { resources } = await container.items.readAll().fetchAll();

        context.log("Data fetched successfully:", resources);

        context.res = {
            status: 200,
            body: `Successfully connected to Cosmos DB! Retrieved ${resources.length} items.`
        };
    } catch (error) {
        context.log.error(`Error: ${error.message}`, error);
        context.res = {
            status: 500,
            body: `Error connecting to Cosmos DB: ${error.message}`
        };
    }
};
