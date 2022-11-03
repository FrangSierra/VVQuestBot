import QuestMessageInterceptor from "../../core/QuestMessageInterceptor.js";
import UserData from "../../core/UserData.js";
import {getTimestampInMilliseconds} from "../../util/functions.js";
import {MessageAttachment} from "discord.js";

class HandleAnswer extends QuestMessageInterceptor {
    async run(message, userData) {
        const questIndex = userData.questIndex
        //Ignore this interceptor if the user is not on a quest
        if (questIndex === -1) return false

        const questManager = this.client.questManager
        const user = message.author

        const currentQuest = questManager.getQuest(questIndex)
        const interactionIndex = userData.interactionIndex > -1 ? userData.interactionIndex : 0 //TODO Fix why this is not getting saved?

        const currentInteraction = questManager.getQuestInteraction(questIndex, interactionIndex)

        if (!currentInteraction.requireAnswer) {
            //Send a mock failure message
            const reply = currentInteraction.customFailureTexts.length > 0 ? currentInteraction.getRandomFailureText() : questManager.getRandomFailureText()
            await user.send(reply)
            return true
        }

        //After a message check if the given message was an answer for the bot. check if its between the answers of the current interaction
        if (!currentInteraction.requireAnswer || currentInteraction.possibleAnswers.some((answer) => answer.toLowerCase() === message.content.toLowerCase())) {
            //If it was an answer, show a success message
            if (currentInteraction.requireAnswer && currentQuest.enableSuccessMessages) {
                const reply = currentInteraction.customSuccessTexts.length > 0 ? currentInteraction.getRandomSuccessText() : questManager.getRandomSuccessText()
                await message.reply({content: reply, ephemeral: true})
            }
            const updatedIndex = interactionIndex + 1
            const nextInteraction = questManager.getQuestInteraction(questIndex, updatedIndex)
            const isLastInteraction = updatedIndex === currentQuest.interactions.length - 1

            //Update user value after handle quest
            const updatedUserData = new UserData(userData.userId, userData.userTag, isLastInteraction ? -1 : userData.questIndex, isLastInteraction ? -1 : updatedIndex, getTimestampInMilliseconds())
            await this.client.storage.set(userData.userId, JSON.stringify(updatedUserData))

            const interactionImages = nextInteraction.imgs
            const attachments = interactionImages.length > 0 ? interactionImages.map((item => new MessageAttachment(item))) : []
            await user.send({content: `*${nextInteraction.message}*`, files: attachments})

            return true
        } else if (currentQuest.enableFailureMessages) {
            const updatedUserData = new UserData(userData.userId, userData.userTag, userData.questIndex, userData.interactionIndex, getTimestampInMilliseconds())
            await this.client.storage.set(userData.userId, JSON.stringify(updatedUserData))

            const reply = currentInteraction.customFailureTexts.length > 0 ? currentInteraction.getRandomFailureText() : questManager.getRandomFailureText()
            await message.reply({content: reply, ephemeral: true})

            return true
        }

        return false
    }
}

export default HandleAnswer