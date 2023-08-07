import { EmbedBuilder, GuildMember } from "discord.js";
import Module from "../module";

export const welcomeMessage: Module = {
    name: "welcomeMessage",

    onReady: (client) => {
        return true;
    },

    handle: async (event, untypedArgs) => {
        if (event !== "guildMemberAdd") return;

        const member = untypedArgs[0] as GuildMember;

        if (!member) return;

        const dm = await member.createDM().catch(() => undefined);

        if (!dm) return;

        const embed = new EmbedBuilder()
            .setTitle("Vítej na serveru!")
            .setDescription(`Vítej na serveru, ${member.user.username}! Tato zpráva by ti měla pomoci se zorientovat na serveru. Přečti si prosím všechny níže uvedené informace.`)
            .addFields([
                {
                    name: "K čemu je tento server?",
                    value: "Tento server slouží k podpoře studentů SSPŠ v předmětech, který učí Cajthaml. Na tomto serveru dostanete neoficiální informace, můžete se neformálně bavit s učiteli a ostatními studenty a taktéž se podívat pod pokličku hodin, úkolů a přípravy."
                },
                {
                    name: "Připojil jsem se. Co teď?",
                    value: "Prvně bude nutné potvrdit úvodní zprávu. Tu najdeš v jediném kanálu, který uvidíš. Po prokliku se zobrazí větší množství kanálů. Nyní uvidíš např. pravidla, které je nutné dodržovat. V kanálu #role si můžeš přidat role, které ti umožní přístup k dalším kanálům."
                },
                {
                    name: "Jsem student nějakého předmětu. Co teď?",
                    value: "Pokud studujete a máš v portálu vytvořený účet, můžeš se verifikovat pomocí příkazu `/verify`. Po zavolání příkazu navštiv portál, resp. stránku Nastavení > Verifikační kód, který zadáš, a automaticky ti bude nastaveno jméno a role." 
                }
            
            ])
            .setColor("#E0A648")
            .setTimestamp();

        await dm.send({ embeds: [embed] }).catch(() => undefined);
    }
}