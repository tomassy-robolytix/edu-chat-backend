const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log("=== Starting HelloFunction ===");

    const endpoint = process.env.COSMOS_DB_CONNECTION_STRING;
    const cosmosClient = new CosmosClient(endpoint);
    const databaseName = "EduChatDB";
    const containerName = "UserProgress";

    const database = cosmosClient.database(databaseName);
    const container = database.container(containerName);

    if (req.method === "PUT") {
        // Editace uživatele
        try {
            const { id, name, progress, grade, sis, sisLogin, sisPassword } = req.body;

            if (!id) {
                throw new Error("Missing ID");
            }

            // Najdi existujícího uživatele
            const { resource: existingUser } = await container.item(id, id).read();
            if (!existingUser) {
                throw new Error("User not found");
            }

            // Aktualizuj data
            const updatedUser = {
                ...existingUser, // Zachová stávající data
                name: name || existingUser.name,
                progress: progress || existingUser.progress,
                grade: grade || existingUser.grade,
                sis: sis || existingUser.sis,
                sisLogin: sisLogin || existingUser.sisLogin,
                sisPassword: sisPassword || existingUser.sisPassword,
            };

            const { resource } = await container.item(id, id).replace(updatedUser);

            context.res = {
                status: 200,
                body: resource,
            };
        } catch (err) {
            context.res = {
                status: 400,
                body: `Error: ${err.message}`,
            };
        }
    } else if (req.method === "GET") {
        // Načtení dat
        const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
        context.res = {
            status: 200,
            body: resources,
        };
    } else if (req.method === "POST") {
        // Přidání uživatele
        try {
            const { id, name, progress, grade, sis, sisLogin, sisPassword } = req.body;

            if (!id || !name || !grade || !sis) {
                throw new Error("Missing required fields");
            }

            const newUser = {
                id,
                name,
                progress,
                grade,
                sis,
                sisLogin,
                sisPassword,
            };

            const { resource } = await container.items.create(newUser);
            context.res = {
                status: 200,
                body: resource,
            };
        } catch (err) {
            context.res = {
                status: 400,
                body: `Error: ${err.message}`,
            };
        }
    } else {
        context.res = {
            status: 405,
            body: "Method Not Allowed",
        };
    }
};
