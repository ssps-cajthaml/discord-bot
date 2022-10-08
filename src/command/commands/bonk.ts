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
        )
        .addIntegerOption(option => option
            .setName("duration")
            .setDescription("Doba trvání bonku v sekundách.")
            .setMinValue(15)
            .setMaxValue(300)
        ),
    
    requiredPermissions: ["SendMessages"],

    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        const target = interaction.options.get("target", true).user;
        if (!target) return;
        if (target.id === null) return;

        let duration = 15;
        const durationOption = interaction.options.get("duration", false);
        if (durationOption)
            duration = durationOption.value as number;

        const votesRequired = Math.ceil(duration / 15);

        // if target has permission manage messages, he can't be bonked
        const targetMember = await interaction.guild.members.fetch(target.id);

        if (targetMember.permissions.has("ManageMessages")) {
            await interaction.reply({
                content: "Tento uživatel nemůže být bonked.",
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            embeds: [
                {
                    title: "🏏 | Bonk",
                    description: `Chceš bonkout ${target.username}?`,
                    fields: [
                        {
                            name: "Co dělá bonk?",
                            value: `Bonk na **${duration} sekund** dá timeout danému uživateli. Potřebných hlasů: **${votesRequired}**.`,
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
            if ((reaction.count - 1) >= votesRequired) {
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
                    if (member.communicationDisabledUntil) {
                        const timeLeft = Math.floor((member.communicationDisabledUntil.getTime() - Date.now()));

                        member.timeout(timeLeft + (duration * 1000), "Bonked by chat vote.");
                    } else {
                        member.timeout(duration * 1000, "Bonked by chat vote.")
                    }
                });

                collector.stop();
            }
        });
    }

} as Command
