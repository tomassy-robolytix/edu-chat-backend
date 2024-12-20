const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('=== Starting HelloFunction ===');

    try {
        const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!endpoint) {
            throw new Error("COSMOS_DB_CONNECTION_STRING is not set.");
        }
        context.log('Connection string is set.');

        const cosmosClient = new CosmosClient(endpoint);
        const databaseName = "EduChatDB";
        const containerName = "UserProgress";

        context.log(`Connecting to database: ${databaseName}, container: ${containerName}`);
        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();

        context.log(`Query executed successfully. Found ${items.length} items.`);
        context.res = {
            status: 200,
            body: items
        };
    } catch (err) {
        context.log.error('=== Error occurred ===');
        context.log.error(`Error message: ${err.message}`);
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    }
};
