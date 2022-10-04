import { CommandInteraction, GuildMemberRoleManager, Interaction, InteractionType } from "discord.js";
import { BotSettings } from "../bot";

export default (settings: BotSettings, interaction: Interaction) => {
 
    if(interaction.type === InteractionType.ApplicationCommand) {
        console.log(`Recieved command interaction for ${interaction.commandName}.`);

        const commandInteraction: CommandInteraction = interaction as CommandInteraction;
        const command = settings.commands.find(command => command.builder.name === commandInteraction.commandName);

        if(!command) return;
        
        if(command.guildOnly) {
            if(!commandInteraction.guild) {
                commandInteraction.reply({
                    content: "Tento příkaz je dostupný pouze na serverech.",
                    ephemeral: true
                });
                return;
            }

            // Should not happen, but just in case.
            if(!commandInteraction.member) return;

            if(command.requiredPermissions && command.requiredPermissions.length > 0) {
                const roleManager = commandInteraction.member.roles as GuildMemberRoleManager;
                const roles = roleManager.cache;

                const hasPermissions = command.requiredPermissions.every(permission => roles.some(role => role.permissions.has(permission)));

                if(!hasPermissions) {
                    commandInteraction.reply({
                        content: "Nemáš dostatečná oprávnění pro použití tohoto příkazu. Je potřeba, abys měl všechny následující oprávnění: " + command.requiredPermissions.join(", "),
                        ephemeral: true
                    });
                    return;
                }
            }
        }


        command.call(commandInteraction, settings);
    } else {
        
    }

};