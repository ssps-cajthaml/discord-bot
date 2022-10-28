import { ActivityType, Client, CommandInteraction, DiscordjsError, PresenceStatusData, SlashCommandBuilder } from "discord.js"
import Command from "../command"
import { BotSettings } from "../../bot";

export default {
    requiredPermissions: ["Administrator"],

    builder: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("Nastaví aktivitu bota.")
        .addIntegerOption(option => option
            .setName("type")
            .setRequired(true)
            .setDescription("Typ aktivity")
            .addChoices(
                { name: "Playing", value: 0 },
                { name: "Competing in", value: 5 },
                // { name: "Custom", value: 4 }, //Custom status is not available for bots (yet? hopefully)
                { name: "Listening to", value: 2 },
                // { name: "Streaming", value: 1 }, //apparently doesn't work for bots either
                { name: "Watching", value: 3 },
            )
        )
        .addStringOption(option => option
            .setName("activitytext")
            .setDescription("Text, který se má ukazovat v aktivitě bota")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("status")
            .setRequired(false)
            .setDescription("Status aktivity")
            .addChoices(
                { name: "Online", value: "online" },
                { name: "Idle", value: "idle" },
                { name: "Invisible", value: "invisible" },
                { name: "Do Not Disturb", value: "dnd" },
            )
        ),

    // PresenceData.status: online, idle, invisible, dnd
    // ActivitiesOptions.type: Competing, Custom, Listening, Playing, Streaming, Watching


    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {

        //shouldn't really happen, but TS screams at me violently if it's not here
        if (client.user == null) {
            console.log("Client.user is null, something probably went wrong.");
            await interaction.reply({ content: "Nepodařilo se nastavit aktivitu. Prosím zkuste to později, nebo kontaktujte vývojáře.", ephemeral: true })
            return;
        }

        const activityText = interaction.options.get("activitytext", true).value as string;
        const activityType = interaction.options.get("type", true)?.value as number;
        const activityStatus = interaction.options.get("status")?.value as string ?? "online";

        client.user?.setPresence({ activities: [{ name: activityText, type: activityType }], status: activityStatus as PresenceStatusData });

        await interaction.reply({ content: "Aktivita byla úspěšně nastavena!", ephemeral: true });
    }

} as Command