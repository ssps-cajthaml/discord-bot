import { CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export default interface Command {
    /**
     * The build data for the command.
     */
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder;
    
    /**
     * Gets called when the command is executed.
     * @param interaction The interaction that triggered the command.
     */
    call: (interaction: CommandInteraction) => Promise<void>;
}