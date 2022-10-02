import { Client, CommandInteractionOptionResolver, REST, Routes, SlashCommandBuilder } from "discord.js";
import Command from "./command/command";
import handler from "./interaction/handler";
import Module from "./module/module";

export class BotSettings {
    public commands: Command[] = [];

    public modules: Module[] = [];
};

export default async (settings: BotSettings) => {
    const client = new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "MessageContent",
            "DirectMessages",
            "GuildVoiceStates",
            "GuildMessageReactions"
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

        console.log("Registering modules.");
        for (const module of settings.modules) {
            if (await module.onReady(client)) {
                console.log(`Module ${module.name} loaded.`);
            } else {
                console.log(`Module ${module.name} not loaded.`);

                settings.modules = settings.modules.filter(m => m !== module);
            }
        }
    });

    client.on("interactionCreate", async (interaction) => {
        handler(settings, interaction);
    });

    client.on("voiceStateUpdate", async (...args) => {
        for (const module of settings.modules) {
            module.handle("voiceStateUpdate", args);
        }
    });
};