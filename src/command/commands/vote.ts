import {
    MessageReaction,
    SlashCommandBuilder,
    User,
    CommandInteraction,
    Client
} from "discord.js"
import Command from "../command"
import {BotSettings} from "../../bot";

export default {
    //TODO: Add a way to add more reaction options

    builder: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vytvoří anketu.")
        .addStringOption(option => option
            .setName("question")
            .setDescription("Otázka, kterou chcete položit.")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("duration")
            .setDescription("Doba, po kterou bude v anketě možné hlasovat. [v sekundách]")
            .setRequired(true)
        ),

    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {
        if (!interaction.guild) return;
        if (!interaction.channel) return;

        //reaction index => reaction amount
        let votes: number[] = [];

        await interaction.reply("Anketa byla vytvořena.");

        // Create voting message
        const message = await interaction.channel.send({
            embeds: [
                {
                    title: "🗳️ | Anketa",
                    description: `**Otázka:** ${interaction.options.get("question", true).value as string}`,
                    color: 0xffa40e,
                    fields: [
                        {
                            name: "👍 | Ano",
                            value: "0",
                            inline: true
                        },
                        {
                            name: "👎 | Ne",
                            value: "0",
                            inline: true
                        }
                    ]
                }
            ]
        });

        const filter = (reaction: any, user: any) => {
            return reaction.emoji.name === "👍" || reaction.emoji.name === "👎" || reaction.emoji.name == "❌" && !user.bot;
        };

        await message.react("👍");
        await message.react("👎");
        await message.react("❌");

        let duration = interaction.options.get("duration", false)?.value as number;
        if (!duration) duration = 60;

        const collector = message.createReactionCollector({ filter, time: duration * 1000, dispose: true });

        let reactionChangeHandle = (reaction: MessageReaction, user: User) => {
            if (reaction.emoji.name == "❌") {
                if (user.id == interaction.user.id) {
                    collector.stop();
                } else {
                    reaction.users.remove(user);
                }
            }

            votes[0] = Math.max(0, (message.reactions.cache.get("👍")?.count || 0) - 1);
            votes[1] = Math.max(0, (message.reactions.cache.get("👎")?.count || 0) - 1);

            message.edit({
                embeds: [
                    {
                        title: "🗳️ | Anketa",
                        description: `**Otázka:** ${interaction.options.get("question", true).value as string}`,
                        color: 0xffa40e,
                        fields: [
                            {
                                name: "👍 | Ano",
                                value: votes[0].toString(),
                                inline: true
                            },
                            {
                                name: "👎 | Ne",
                                value: votes[1].toString(),
                                inline: true
                            }
                        ]
                    }
                ]
            });

        };

        collector.on("collect", (reaction: MessageReaction, user: User) => {
            reactionChangeHandle(reaction, user);
        });

        collector.on("remove", (reaction: MessageReaction, user: User) => {
            reactionChangeHandle(reaction, user);
        });

        collector.on("end", (collected: any, reason: string) => {
            message.delete();
            collector.stop();

            //Create new message with results
            interaction.channel?.send({
                embeds: [
                    {
                        title: "🗳️ | Anketa",
                        description: `**Otázka:** ${interaction.options.get("question", true).value as string}`,
                        color: 0xffa40e,
                        fields: [
                            {
                                name: "Výsledky:",
                                value: `👍 | Ano: ${votes[0] == undefined ? 0 : votes[0]}\n\n👎 | Ne: ${votes[1] == undefined ? 0 : votes[1]}`,
                                inline: false
                            }
                        ]
                    }
                ]
            });
        });

    }

} as Command
