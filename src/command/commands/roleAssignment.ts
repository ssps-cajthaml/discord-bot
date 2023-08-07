import { ChannelType, Client, CommandInteraction, PresenceStatusData, SlashCommandBuilder, TextChannel } from "discord.js"
import Command from "../command"
import { BotSettings } from "../../bot";
import * as fs from "fs";


export default {
    requiredPermissions: ["Administrator"],

    builder: new SlashCommandBuilder()
        .setName("roleassignment")
        .setDescription("Nastavení reakce na zprávu pro přidání role")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Kanál, ve kterém se má zpráva nacházet")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("message")
            .setDescription("ID zprávy, na kterou se má reagovat")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("Emoji, které se má použít")
            .setRequired(true)
        )
        .addRoleOption(option => option
            .setName("role")
            .setDescription("Role, která se má přidat")
            .setRequired(true)
        ),

    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {
        if (client.user == null) {
            console.log("Client.user is null, something probably went wrong.");
            await interaction.reply({ content: "Nepodařilo se spustit příkaz. Prosím zkuste to později, nebo kontaktujte administrátora.", ephemeral: true })
            return;
        }

        const channel = interaction.options.get("channel", true).channel;
        const message = interaction.options.get("message", true).value as string;
        const emoji = interaction.options.get("emoji", true).value as string;
        const role = interaction.options.get("role", true).role;

        if (!channel) {
            await interaction.reply({ content: "Kanál nebyl nalezen.", ephemeral: true });
            return;
        }
        
        if (!role) {
            await interaction.reply({ content: "Role nebyla nalezena.", ephemeral: true });
            return;
        }

        if(channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: "Kanál musí být textový.", ephemeral: true });
            return;
        }

        // Find message in channel
        const channelMessage = await (channel as TextChannel).messages.fetch(message);

        if (!channelMessage) {
            await interaction.reply({ content: "Zpráva nebyla nalezena.", ephemeral: true });
            return;
        }

        // React to message
        channelMessage.react(emoji);

        // Load env
        let assignments = process.env.ROLE_ASSIGNMENTS;

        if (!assignments) {
            assignments = "";
        }

        // Add assignment to env
        assignments += `${channel.id}:${message}:${emoji}:${role.id};`;

        
        fs.readFile(".env", (err, data) => {
            if (err) throw err;
            let envLines = data.toString().split('\n');

            envLines = envLines.filter(x => !x.startsWith("ROLE_ASSIGNMENTS"));

            envLines.push(`ROLE_ASSIGNMENTS=${assignments}`);

            fs.writeFileSync(".env", envLines.join('\n'));
        });

        await interaction.reply({ content: "Role byla přidána.", ephemeral: true });
    }

} as Command