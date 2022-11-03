import ButtonInteraction from "../core/ButtonInteraction.js";
import {getTimestampInMilliseconds} from "../util/functions.js";
import UserData from "../core/UserData.js";
import {MessageAttachment} from "discord.js";


const BOT_COMMAND_HELP = `**--------------------------------------------------------------------------------------------**
*Welcome ta tha Frostfire Tavern mortal!*\n
*I'm Dur an' this Fella at my side be me brother Din. The pleasure be ours!*
*Ye just came ta tha right place ta live a new adventure or hear an old tale o' tha Vulcanverse. Fellas like Neswulf or Dangermous have sit down where ye be. So stay awhile an' listen.*

**If its your first time dont't forget to make use scream out loud those commands:**
*- !hint  -- If your current quest interaction allow hints. The bot will give you one of those. *
*- !reset -- Reset your progress during any quest. Feel free to start a new one using /startQuest. *
*- !skip  -- If your current quest interaction allow skipping. The bot will skip to the next step of the quest.*
*- !about -- Learn more about the project and the owner.*

**Below you will found the start of your quest. Enjoy it and if you have any problem contact: @Durdin#5634**
**--------------------------------------------------------------------------------------------**
`

class ChooseQuestMenu extends ButtonInteraction {
    async run(interaction) {
        const selectedItem = interaction.values[0]
        const selectedQuest = this.client.questManager.getQuest(selectedItem)

        const user = interaction.user ? interaction.user : interaction.member

        if (!user) {
            console.log("User is null when choosing a quest")
            return
        }

        if (selectedQuest) {
            //Delete the selector message
            //Start quest
            const interactionIndex = 0
            const currentInteraction = selectedQuest.interactions[interactionIndex]

            //Set user data
            const newUserData = new UserData(user.id, user.username, selectedItem, interactionIndex, getTimestampInMilliseconds())
            this.client.storage.set(newUserData.userId, JSON.stringify(newUserData))

            //Send first interaction and images if needed
            await user.send({
                //content: ``,
                files: ["./resources/imgs/tavernkeepers.jpg"]
            })
            await user.send(BOT_COMMAND_HELP)

            const interactionImages = currentInteraction.imgs
            const attachments = interactionImages.length > 0 ? interactionImages.map((item => new MessageAttachment(item))) : []
            await user.send({content: `*${currentInteraction.message}*`, files: attachments})
        } else {
            await interaction.update("There was an error chosing your item")
        }
    }
}

export default ChooseQuestMenu