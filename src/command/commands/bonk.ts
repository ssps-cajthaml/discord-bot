import {SlashCommandBuilder} from "discord.js"
import Command from "../command"

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
    call: async (interaction) => {
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
                    description: `Hlasování o bonku pro ${target} bylo spuštěno.`,
                    color: 0xffa40e,
                }
            ],
            ephemeral: true
        })
        let message = await interaction.channel.send({
            embeds: [
                {
                    title: "🏏 | Bonk",
                    description: `Chceš bonkout ${target.username}?`,
                    fields: [
                        {
                            name: "Co dělá bonk?",
                            value: `Bonk na 5 sekund dá timeout danému uživateli. Je potřeba aby odhlasovalo nejméně 5 lidí.`,
                            inline: true
                        },
                    ],
                    color: 0xffa40e,

                }
            ],
        });

        const filter = (reaction: any, user: any) => {
            return reaction.emoji.name === '👍' && !user.bot;
        };

        await message.react('👍');

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction: any, user: any) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if(reaction.count >= requiredVotes) {
                // @ts-ignore
                interaction.channel.send({
                    embeds: [
                        {
                            title: "🏏 | Bonk'd",
                            description: `${target.username} dostal bonked.`,
                            color: 0xffa40e,
                        }
                    ],
                });

                if(!interaction.guild) return;
                interaction.guild.members.fetch(target.id).then(member => {
                    member.timeout(5 * 1000)
                });

                collector.stop();
            }
        });
    }

} as Command