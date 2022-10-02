import {CommandInteraction, MessageReaction, SlashCommandBuilder, User} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("bonk")
        .setDescription("Spustí hlasování o dočasném timeoutu na uživatele.")
        .addUserOption(option => option
            .setName("target")
            .setDescription("Osoba, která dostane bonk.")
            .setRequired(true)
        ),
    
    requiredPermissions: ["SendMessages"],

    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        const requiredVotes = 3;
        const target = interaction.options.get("target", true).user;
        if (!target) return;
        if (target.id === null) return;

        await interaction.reply({
            embeds: [
                {
                    title: "🏏 | Bonk",
                    description: `Chceš bonkout ${target.username}?`,
                    fields: [
                        {
                            name: "Co dělá bonk?",
                            value: `Bonk na 5 sekund dá timeout danému uživateli. Je potřeba aby odhlasovali nejméně 3 lidé.`,
                            inline: true
                        },
                    ],
                    color: 0xffa40e,

                }
            ],
        });

        const message = await interaction.fetchReply();

        const filter = (reaction: MessageReaction, user: User) => {
            return reaction.emoji.name === '👍' && !user.bot;
        };

        await message.react('👍');

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction: MessageReaction, user: User) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (reaction.count >= requiredVotes) {
                if (!interaction.channel) return;

                interaction.editReply({
                    embeds: [
                        {
                            title: "🏏 | Bonk'd",
                            description: `Na základě hlasování dostal ${target.username} bonked.`,
                            color: 0xffa40e,
                        }
                    ],
                });

                if (!interaction.guild) return;
                interaction.guild.members.fetch(target.id).then(member => {
                    member.timeout(5 * 1000)
                });

                collector.stop();
            }
        });
    }

} as Command
