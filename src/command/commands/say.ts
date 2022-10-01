import { SlashCommandBuilder } from "discord.js"
import Command from "../command"

export default {
    builder: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Bot řekne zprávu za Vás")
        .addStringOption(option => option
            .setName("message")
            .setDescription("Text, který chcete sdělit")
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(3500)
        ),

    call: async (interaction) => {
        const message = interaction.options.get("message", true).value as string;

        await interaction.reply(message);
    }

} as Command