import { CommandInteraction, SlashCommandBuilder, User, AttachmentBuilder, GuildMember } from "discord.js"
import Command from "../command"
import { BotSettings } from "../../bot";
import Jimp from 'jimp';
import fs from 'fs';

export default {
    builder: new SlashCommandBuilder()
        .setName("slap")
        .setDescription("Dá flákanec vybranému uživateli.")
        .addUserOption(option => option
            .setName("target")
            .setDescription("Osoba, která dostane flákanec.")
            .setRequired(true)
        ),


    call: async (interaction: CommandInteraction, settings: BotSettings) => {
        //Added variables because of TS compilation error :)
        let opUser = interaction.member?.user;
        let opMember = interaction.member;
        let targetMember = interaction.options.get("target", true).member;

        if (!(opUser instanceof User)) return;
        if (!(opMember instanceof GuildMember)) return;
        if (!(targetMember instanceof GuildMember)) return;

        //Gets time for later use
        const time = Date.now();

        //Gets OP and Target profile picture in png format (because jimp does not support webp)
        const targetPFP = await (interaction.options.get("target", true).user?.displayAvatarURL() ?? "").replace("webp", "png");
        const opPFP = await (opUser?.displayAvatarURL() ?? "").replace("webp", "png");

        //Adds image to Jimp and resizes it to 50x50px
        let opImage = await Jimp.read(opPFP);
        opImage = await opImage.resize(50, 50);

        let targetImage = await Jimp.read(targetPFP);
        targetImage = await targetImage.resize(50, 50);

        //Requests image to overlay
        const image = await Jimp.read('./resources/slap.jpg');

        //Maually overlay OP and Target profile pictures on source image via coords
        await image.blit(opImage, 117, 112);
        await image.blit(targetImage, 206, 54);

        //Writes image to temp file, uses time defined previously to differentiate simultaneously running instances
        await image.writeAsync('temp/generated' + time + '.png');

        //Creates attachment ready to be sent to server
        const file = new AttachmentBuilder('./temp/generated' + time + '.png');

        await interaction.reply({
            embeds: [
                {
                    title: "😲 | Get slapped!",
                    description: `Cože? Uživatel **` + opMember?.displayName + `** dal právě flákanec uživateli **` + targetMember?.displayName + `**. To muselo bolet!`,
                    image: {
                        url: 'attachment://generated' + time + '.png',
                    },
                    color: 0x830b2e,

                }
            ],
            files: [file]
        });

        //Deletes temp file
        fs.unlinkSync('./temp/generated' + time + '.png');
    }

} as Command
