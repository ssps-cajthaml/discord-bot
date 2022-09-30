import { Client } from "discord.js";

(async () => {
    const client = new Client({
        intents: [
            "Guilds",
            "DirectMessages"
        ],
    });

    await client.login(process.env.BOT_TOKEN);

    client.on("ready", () => {
        console.log("Ready!");
    });
})();