import { Client, CommandInteractionOptionResolver, REST, Routes, SlashCommandBuilder, PresenceStatusData } from "discord.js";
import Command from "./command/command";
import handler from "./interaction/handler";
import Module from "./module/module";

export class BotSettings {
    public commands: Command[] = [];

    public modules: Module[] = [];
};

export default async (settings: BotSettings) => {
    console.log("Bot is starting...");

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

        console.log("Loading and setting activity...");
        if (process.env.ACTIVITY_TYPE && process.env.ACTIVITY_STATUS && process.env.ACTIVITY_TEXT) {
            try {
                client.user?.setPresence({ activities: [{ name: process.env.ACTIVITY_TEXT, type: +process.env.ACTIVITY_TYPE }], status: process.env.ACTIVITY_STATUS as PresenceStatusData });
                console.log("Bot activity status loaded.");
            } catch {
                console.log("Couldn't load saved activity - there's some erorr in the file/syntax");
            }
        } else {
            console.log("Couldn't find saved activity.");
        }
    });

    client.on("interactionCreate", async (interaction) => {
        handler(settings, interaction, client);
    });

    client.on("voiceStateUpdate", async (...args) => {
        for (const module of settings.modules) {
            module.handle("voiceStateUpdate", args);
        }
    });

    client.on("messageReactionAdd", async (...args) => {
        for (const module of settings.modules) {
            module.handle("messageReactionAdd", args);
        }
    });

    client.on("messageReactionRemove", async (...args) => {
        for (const module of settings.modules) {
            module.handle("messageReactionRemove", args);
        }
    });
};