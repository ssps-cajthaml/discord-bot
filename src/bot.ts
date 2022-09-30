import { Client, CommandInteractionOptionResolver, REST, Routes, SlashCommandBuilder } from "discord.js";
import Command from "./command/command";
import handler from "./interaction/handler";

export class BotSettings {
    public commands: Command[] = [];
};

export default async (settings: BotSettings) => {
    const client = new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "MessageContent",
            "DirectMessages"
        ],
    });

    await client.login(process.env.BOT_TOKEN);

    client.on("ready", async () => {
        console.log("Bot is ready.");

        const rest = new REST({ version: "9" }).setToken(
            process.env.BOT_TOKEN as string
        );

        if (!client.user || !client.user.id) return;

        console.log("Registering commands.");

        await rest.put(
            Routes.applicationCommands(
                client.user.id
            ),
            { 
                body: settings.commands.map(command => command.builder.toJSON())
            }
        );
        console.log("Commands registered.");
    });

    client.on("interactionCreate", async (interaction) => {
        handler(settings, interaction);
    });
};