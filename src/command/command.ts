import { CommandInteraction, PermissionFlags, PermissionResolvable, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import {BotSettings} from "../bot";

export default interface Command {
    /**
     * The build data for the command.
     */
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder;

    settings: BotSettings;
    guildOnly?: boolean;
    requiredPermissions?: PermissionResolvable[];
    
    /**
     * Gets called when the command is executed.
     * @param interaction The interaction that triggered the command.
     */
    call: (interaction: CommandInteraction, settings: BotSettings) => Promise<void>;
}