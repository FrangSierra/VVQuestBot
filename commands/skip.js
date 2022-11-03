import Command from "../core/Command.js"
import UserData from "../core/UserData.js";
import {getTimestampInMilliseconds} from "../util/functions.js";
import {MessageAttachment} from "discord.js";

class Skip extends Command {
    async run(message, userData) {
        //This command is only for dm use
        if (message.guild) return

        if (userData.questIndex === -1 || userData.interactionIndex === -1) {
            await message.author.send("*You are not running any quest Mortal. What do you wanna skip?*")
            return
        }
        const currentQuest = this.client.questManager.getQuest(userData.questIndex)
        const currentInteraction = currentQuest.interactions[userData.interactionIndex]

        if (userData.interactionIndex === currentQuest.interactions.length - 1) {
            return
        }

        if (currentQuest.allowSkip || !currentInteraction.requireAnswer) {
            //Set user data
            const newInteractionIndex = userData.interactionIndex + 1
            const nextInteraction = currentQuest.interactions[newInteractionIndex]
            const newUserData = new UserData(userData.userId, userData.tag, userData.questIndex, newInteractionIndex, userData.lastMessageTimestamp)
            await this.client.storage.set(userData.userId, JSON.stringify(newUserData))

            const interactionImages = nextInteraction.imgs
            const attachments = interactionImages.length > 0 ? interactionImages.map((item => new MessageAttachment(item))) : []
            await message.author.send({content: `*${nextInteraction.message}*`, files: attachments})
        } else {
            const reply = "*Sorry Mortal, you can't skip this challenge*"
            await message.reply({content: reply, ephemeral: true})
        }
    }
}

export default Skip