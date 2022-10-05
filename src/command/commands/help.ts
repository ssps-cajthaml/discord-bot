import {CommandInteraction, SlashCommandBuilder} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Zobrazí všechny dostupné commandy."),
    
    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        console.log(settings.commands);

        let fields = settings.commands.map(command => {
            return {
                name: command.builder.name,
                value: command.builder.description,
                inline: true
            };
        });

        await interaction.reply({
            embeds: [
                {
                    title: "🏓 | Nápověda",
                    description: `Aktuálně dostupné příkazy:`,
                    fields: fields,
                    color: 0xffa40e,
                    footer: {
                        text: "**Autoři**:\nMatěj Cajthaml, Denis Lenger, Matyáš Himmer, Sebastian Himmer",
                    }
                }
            ],
            ephemeral: true
        });
    }

} as Command