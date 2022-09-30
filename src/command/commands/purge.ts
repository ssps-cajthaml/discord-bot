import { SlashCommandBuilder, TextChannel } from "discord.js"
import Command from "../command"

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

    

    call: async (interaction) => {
        const count = interaction.options.get("count", true).value as number;

        if(!interaction.guild) return;
        if(!interaction.channel) return;
        if(!interaction.channel.isTextBased()) return;

        const textBasedChannel = interaction.channel as TextChannel;
        const messages = await textBasedChannel.bulkDelete(count, true);

        await interaction.reply({
            content: `Smazáno ${messages.size} zpráv.`,
            ephemeral: true
        });
    }

} as Command