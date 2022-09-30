import { CommandInteraction, PermissionFlags, PermissionResolvable, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export default interface Command {
    /**
     * The build data for the command.
     */
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder;

    guildOnly?: boolean;
    requiredPermissions?: PermissionResolvable[];
    
    /**
     * Gets called when the command is executed.
     * @param interaction The interaction that triggered the command.
     */
    call: (interaction: CommandInteraction) => Promise<void>;
}