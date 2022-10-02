import {CommandInteraction, SlashCommandBuilder, TextChannel} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Smaže zadaný počet zpráv v tomto kanálu.")
        .addIntegerOption(option => option
            .setName("count")
            .setDescription("Počet zpráv, které chcete smazat.")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        ),

    guildOnly: true,
    requiredPermissions: ["ManageMessages"],

    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        const count = interaction.options.get("count", true).value as number;

        if (!interaction.guild) return;
        if (!interaction.channel) return;
        if (!interaction.channel.isTextBased()) return;

        const textBasedChannel = interaction.channel as TextChannel;
        const messages = await textBasedChannel.bulkDelete(count, true);

        await interaction.reply({
            content: `Smazáno ${messages.size} zpráv.`,
            ephemeral: true
        });
    }

} as Command