const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log("Testing connection to Cosmos DB...");

    try {
        // Získání connection string
        const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!endpoint) throw new Error("COSMOS_DB_CONNECTION_STRING is missing.");

        context.log("Connecting to Cosmos DB...");
        const cosmosClient = new CosmosClient(endpoint);

        // Test jednoduchého připojení k databázi
        const databaseName = "edu-chat-db";
        const containerName = "edu-chat-container";
        const container = cosmosClient.database(databaseName).container(containerName);

        const { resources } = await container.items.readAll().fetchAll();

        context.log("Connected successfully. Items fetched:", resources.length);

        context.res = {
            status: 200,
            body: `Successfully connected to Cosmos DB! Retrieved ${resources.length} items.`
        };
    } catch (error) {
        context.log(`Error: ${error.message}`);
        context.res = {
            status: 500,
            body: `Error connecting to Cosmos DB: ${error.message}`
        };
    }
};
