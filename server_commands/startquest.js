import ServerCommand from "../core/ServerCommand.js";
import {InteractionCollector, MessageActionRow, MessageSelectMenu} from "discord.js";

class StartQuest extends ServerCommand {

    constructor(client, name) {
        super(client, name, "Start the choosen quest", []);
    }

    async run(interaction) {
        const availableQuests = this.client.questManager.quests
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('chooseQuestMenu')
                    .setPlaceholder('None')
                    .addOptions(
                        availableQuests.map((quest, index) => {
                            console.log(`options ${quest.title}, ${index}`)
                            return {
                                label: quest.title,
                                description: quest.description,
                                value: `${index}`
                            }
                        })));
        //const user = interaction.user ? interaction.user : interaction.member
        await interaction.reply({content: "Choose a quest Mortal", ephemeral: true, components: [row]});
        const message = await interaction.fetchReply();

        const filter = (interaction) => {
            return interaction.customId === 'chooseQuestMenu'
        };
        const collector = message.createMessageComponentCollector(filter, {time: 10000});
        collector.on('collect', (i) => {
            if (i.customId === "chooseQuestMenu") {
                //Update message to remove selector menu
                interaction.editReply({
                    content: `You have choosen the quest ${availableQuests[i.values[0]].title}`,
                    ephemeral: true,
                    components: []
                })
                collector.stop()
            }
        })
    }
}

export default StartQuest