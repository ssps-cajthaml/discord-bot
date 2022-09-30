import { CommandInteraction, Interaction, InteractionType } from "discord.js";
import { BotSettings } from "../bot";

export default (settings: BotSettings, interaction: Interaction) => {
 
    if(interaction.type === InteractionType.ApplicationCommand) {
        console.log(`Recieved command interaction for ${interaction.commandName}.`);

        const commandInteraction: CommandInteraction = interaction as CommandInteraction;
        const command = settings.commands.find(command => command.builder.name === commandInteraction.commandName);

        if(!command) return;

        command.call(commandInteraction);
    } else {

    }

};