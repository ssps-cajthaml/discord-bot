import Module from "../module";

import { ChannelType, TextChannel, VoiceChannel, VoiceState } from "discord.js";

interface MessageRoleReaction {
    channelId: string;
    messageId: string;
    emoji: string;
    roleId: string;
}

const messageRoleReactions: MessageRoleReaction[] = [];

export const roleAssignment: Module = {
    name: "roleAssignment",

    onReady: async(client) => {
        // Load assignments from env
        const assignments = process.env.ROLE_ASSIGNMENTS;
        
        if (!assignments) {
            console.log("No role assignments found in env");
            return true;
        }

        const assignmentsSplit = assignments.split(";");

        for (const assignment of assignmentsSplit) {
            const assignmentSplit = assignment.split(":");

            if(assignmentSplit.length !== 4) continue;

            const channelId = assignmentSplit[0];
            const messageId = assignmentSplit[1];
            const emoji = assignmentSplit[2];
            const roleId = assignmentSplit[3];

            messageRoleReactions.push({
                channelId,
                messageId,
                emoji,
                roleId
            });
        }

        console.log(`Loaded ${messageRoleReactions.length} role assignments`);

        // Review all messages and react if needed
        for (const mrr of messageRoleReactions) {
            const channel = client.channels.cache.get(mrr.channelId);

            if (!channel || channel.type !== ChannelType.GuildText) continue;

            const message = await (channel as TextChannel).messages.fetch(mrr.messageId);

            if (!message) continue;

            message.react(mrr.emoji);
        }

        return true;
    },

    handle: async (event, untypedArgs) => {
        if (!["messageReactionAdd", "messageReactionRemove"].includes(event))
            return;

        const messageReaction = untypedArgs[0];
        const message = messageReaction.message;
        const user = untypedArgs[1];
        const guild = message.guild;

        if (!guild || !user || user.bot) return;

        const member = guild.members.cache.get(user.id);


        const forMessage = messageRoleReactions.filter(mrr => mrr.messageId === message.id);

        if (forMessage.length === 0) return;

        const forEmoji = forMessage.filter(mrr => mrr.emoji === messageReaction.emoji.name);

        if (forEmoji.length === 0) return;


        const roles = forEmoji.map(mrr => guild.roles.cache.get(mrr.roleId));

        if (event === "messageReactionAdd") {
            // Roles that the user doesn't have
            const rolesToAdd = roles.filter(role => !member.roles.cache.has(role.id));

            member.roles.add(rolesToAdd);
        } else {
            // Roles that the user has
            const rolesToRemove = roles.filter(role => member.roles.cache.has(role.id));

            member.roles.remove(rolesToRemove);
        }
    }
}