import {CommandInteraction, MessageReaction, SlashCommandBuilder, User} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Spustí giveaway na který budou moct uživatele reagovat.")
        .addStringOption(option => option
            .setName("description")
            .setDescription("Popis giveawaye.")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("length")
            .setDescription("Délka giveawaye v dnech.")
            .setRequired(true)
        ),
    
    requiredPermissions: ["SendMessages"],

    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        let stringFormat: string;
        let entries: User[] = [];

        switch (interaction.options.get("length", true).value as number) {
            case 1:
                stringFormat = "den";
                break;
            case 2:
                stringFormat = "dny";
                break;
            case 3:
                stringFormat = "dny";
                break;
            case 4:
                stringFormat = "dny";
                break;
            case 5:
                stringFormat = "dnů";
                break;
            default:
                stringFormat = "dnů";
        }

        await interaction.reply({
            embeds: [
                {
                    title: "🎁 | Giveaway",
                    description: interaction.options.get("description", true).value as string,
                    fields: [
                        {
                            name: "Do giveawaye se můžeš přihlásit pomocí reakce 🎁",
                            value: `Na konci bude vybráný náhodný user, který reagoval na tuto zprávu.`,
                            inline: true
                        },
                        {
                            name: "Giveaway bude trvat",
                            value: interaction.options.get("length", true).value as number + " " + stringFormat,
                            inline: true
                        },
                    ],
                    color: 0xffa40e,

                }
            ],
        });

        const message = await interaction.fetchReply();

        const filter = (reaction: MessageReaction, user: User) => {
            return reaction.emoji.name === '🎁' && !user.bot;
        };

        await message.react('🎁');

        const collector = message.createReactionCollector({ filter, time: interaction.options.get("length", true).value as number});

        collector.on('collect', (reaction: MessageReaction, user: User) => {
            entries.push(user);
        });

        collector.on('end', () => {
              const winner = entries[Math.floor(Math.random() * entries.length)];
              console.log(winner);
              interaction.editReply({
                  embeds: [
                      {
                          title: "🎁 | Giveaway",
                          description: interaction.options.get("description", true).value as string,
                          fields: [
                              {
                                  name: "Výhercem giveawaye se stává!!!",
                                  value: "ben",
                                  inline: true
                              }
                          ],
                          color: 0xffa40e,
                      }
                  ],
              });
        });
    }

} as Command
