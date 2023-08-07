import Module from "../module";

import { ChannelType, GuildChannel, VoiceChannel, VoiceState } from "discord.js";

let channel = undefined as VoiceChannel | undefined;
let names = [] as string[];

export const voice: Module = {
    name: "voice",

    onReady: (client) => {
        if (!process.env.MODULE_AUTOMATIC_VOICE_CHANNEL) {
            console.log("Automatic voice channel module is not enabled.");
            return false;
        }

        const voiceChannel = client.channels.cache.get(process.env.MODULE_AUTOMATIC_VOICE_CHANNEL);

        if (!voiceChannel || !voiceChannel.isVoiceBased() || !(voiceChannel instanceof VoiceChannel)) {
            console.error(`Channel for Automatic Voice (ID=${process.env.MODULE_AUTOMATIC_VOICE_CHANNEL}) not found.`);
            return false;
        }

        channel = voiceChannel as VoiceChannel;
        names = process.env.MODULE_AUTOMATIC_VOICE_CHANNEL_NAMES?.split(",") || ["yoko"];

        return true;
    },

    handle: async (event, untypedArgs) => {
        if (event !== "voiceStateUpdate") return;

        const args = {
            oldState: untypedArgs[0] as VoiceState,
            newState: untypedArgs[1] as VoiceState
        };

        if (args.newState && args.newState.channelId === process.env.MODULE_AUTOMATIC_VOICE_CHANNEL) {
            if (!args.newState.member) return;

            const newChannel = await args.newState.guild.channels.create({
                name: names[Math.floor(Math.random() * names.length)],
                type: ChannelType.GuildVoice,
                parent: channel?.parent,
            }) as VoiceChannel;

            if (!newChannel) return;

            console.log(`Created channel ${newChannel.name} (${newChannel.id}) for ${args.newState.member?.displayName}.`);

            args.newState.setChannel(newChannel);
        }

        if (args.oldState && args.oldState.channelId != undefined) {
            const voiceChannel = args.oldState.channel as VoiceChannel;

            if (voiceChannel != null && voiceChannel != undefined && voiceChannel instanceof VoiceChannel) {
                if (voiceChannel.parentId !== channel?.parentId) return;

                if (voiceChannel.id === channel?.id) return;

                if (voiceChannel.members.size > 0)
                    return;

                console.log(`Deleting channel ${voiceChannel.name} (${voiceChannel.id}) for ${args.oldState.member?.displayName}.`);

                voiceChannel.delete();
            }
        }
    }
}