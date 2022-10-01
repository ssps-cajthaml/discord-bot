import {SlashCommandBuilder} from "discord.js"
import Command from "../command"

export default {
    builder: new SlashCommandBuilder()
        .setName("bonk")
        .setDescription("Spustí hlasování o dočasném timeout na uživatele.")
        .addUserOption(option => option
            .setName("target")
            .setDescription("Osoba, která dostane bonk.")
            .setRequired(true)
        ),
    requiredPermissions: ["SendMessages"],
    call: async (interaction) => {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        const target = interaction.options.get("target", true).user;
        if (!target) return;
        if (target.id === null) return;

        interaction.reply({
            content: `Hlasování o bonku pro ${target} bylo spuštěno.`,
            ephemeral: true
        })
        let message = await interaction.channel.send({
            content: `Chceš bonkout ${target.username}?`,
        });

        const filter = (reaction: any, user: any) => {
            return reaction.emoji.name === '👍' && user.id === message.author.id;
        };

        message.react('👍');

        const collector = message.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction: any, user: any) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if(message.reactions.cache.get('👍') === undefined) return;

            // @ts-ignore
            if(message.reactions.cache.get('👍').count === 2) {
                message.channel.send(`${target} dostal bonk!`);
                collector.stop();
            };
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
        // interaction.guild.members.fetch(target.id).then(member => {
        //     // member.timeout(5 * 1000).catch(() => {
        //     //     console.log("cant bonk")
        //     //     interaction.reply({
        //     //         content: "Nepodařilo se nastavit timeout.",
        //     //         ephemeral: true
        //     //     });
        //     //     interacted = true;
        //     // });
        //
        // });
    }

} as Command