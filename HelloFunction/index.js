const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    try {
        context.log('Starting HelloFunction...');

        const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!endpoint) {
            throw new Error("COSMOS_DB_CONNECTION_STRING is not set.");
        }

        context.log("Connection string loaded.");

        const cosmosClient = new CosmosClient(endpoint);
        const databaseName = "EduChatDB";
        const containerName = "UserProgress";

        context.log(`Connecting to database: ${databaseName}, container: ${containerName}`);

        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();

        context.log("Query executed successfully.");
        context.res = {
            status: 200,
            body: items
        };
    } catch (error) {
        context.log.error("An error occurred:", error.message);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    }
};
