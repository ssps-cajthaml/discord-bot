import { ActivityType, ButtonStyle, Client, CommandInteraction, ComponentType, DiscordjsError, PresenceStatusData, SlashCommandBuilder, TextInputStyle } from "discord.js"
import Command from "../command"
import { BotSettings } from "../../bot";

export default {
    builder: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Ověří uživatele na serveru z kódu z portálu."),

    call: async (interaction: CommandInteraction, settings: BotSettings, client: Client) => {
        if (client.user == null) {
            console.log("Client.user is null, something probably went wrong.");
            await interaction.reply({ content: "Nepodařilo se spustit příkaz. Prosím zkuste to později, nebo kontaktujte administrátora.", ephemeral: true })
            return;
        }

        const guildId = process.env.GUILD_ID ?? "";
        const guild = client.guilds.cache.get(guildId);

        if (guild == null) {
            console.log("Guild is null, something probably went wrong.");
            await interaction.reply({ content: "Nepodařilo se spustit příkaz. Prosím zkuste to později, nebo kontaktujte administrátora.", ephemeral: true })
            return;
        }

        const portalApiUrl = process.env.PORTAL_API_URL ?? "";

        await interaction.showModal({
            title: "Ověření uživatele",
            customId: "verify",
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            label: "Kód z portálu",
                            customId: "code",
                            style: TextInputStyle.Paragraph,
                            placeholder: "Kód naleznete na portálu ssps.cajthaml.eu v sekci Nastavení, které se objeví po přihlášení.",
                        },
                    ],
                },
            ],
        });

        const result = await interaction.awaitModalSubmit({
            time: 60000
        });

        result.deferUpdate();

        const code = result.fields.fields.find(field => field.customId === "code")?.value;

        if(!code) {
            interaction.reply({ content: "Nebyl zadán žádný kód.", ephemeral: true });
        }

        interaction.followUp({ content: "Ověřování...", ephemeral: true});

        const response = await fetch(`${portalApiUrl}/verify/${code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if(data.meta.status !== 'success') {
            interaction.followUp({ content: "Nepodařilo se ověřit uživatele. Zkontrolujte prosím zadaný kód.", ephemeral: true});
            return;
        }

        interaction.followUp({ content: "Nastavování jména...", ephemeral: true});

        const name = data.data.user.name;
        const subjects = data.data.subjects;
        const groups = data.data.groups;

        const member = await guild.members.fetch(result.user.id);
        
        const discordName = name.split(" ").reverse().join(" ");

        // has permissions to change nickname?
        if(member.manageable)
            member.setNickname(discordName);

        const subjectMappings = (process.env.VERIFY_SUBJECT_MAPPINGS ?? "").split(";").map(mapping => mapping.split(":"));
        const groupMappings = (process.env.VERIFY_GROUP_MAPPINGS ?? "").split(";").map(mapping => mapping.split(":"));

        const subjectRoles = [];

        for(const subject of subjects) {
            const mapping = subjectMappings.find(mapping => mapping[0] === subject);
            if(mapping) {
                const role = guild.roles.cache.find(role => role.id === mapping[1]);
                if(role) {
                    subjectRoles.push(role);
                } else {
                    console.log(`Role ${mapping[0]} for subject found in mappings not found in guild.`);
                }
            } else {
                console.log(`Subject ${subject} not found in mappings.`);
            }
        }

        const groupRoles = [];

        for(const group of groups) {
            const mapping = groupMappings.find(mapping => mapping[0] === group);
            if(mapping) {
                const role = guild.roles.cache.find(role => role.id === mapping[1]);
                if(role) {
                    groupRoles.push(role);
                } else {
                    console.log(`Role ${mapping[0]} for group found in mappings not found in guild.`);
                }
            } else {
                console.log(`Group ${group} not found in mappings.`);
            }
        }

        const rolesToAdd = [...subjectRoles, ...groupRoles].filter(role => !member.roles.cache.has(role.id));

        if(rolesToAdd.length > 0) {
            interaction.followUp({ content: "Role přidány. Úspešně ověřeno.", ephemeral: true});
            member.roles.add(rolesToAdd);
        } else {
            interaction.followUp({ content: "Žádné role k přidání. Úspešně ověřeno.", ephemeral: true});
        }

        console.log(`User ${name} verified, added roles ${rolesToAdd.map(role => role.name).join(", ")}.`);
    }

} as Command