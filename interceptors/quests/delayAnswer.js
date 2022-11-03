import QuestMessageInterceptor from "../../core/QuestMessageInterceptor.js";
import {getTimestampInMilliseconds} from "../../util/functions.js";

class DelayAnswer extends QuestMessageInterceptor {
    async run(message, userData) {
        const questIndex = userData.questIndex
        //Ignore this interceptor if the user is not on a quest
        if (questIndex === -1) return false

        const lastUserMessageTimestamp = userData.lastMessageTimestamp
        const currentTimestamp = getTimestampInMilliseconds()

        const currentQuest = this.client.questManager.getQuest(questIndex)
        const questDelay = currentQuest.delayBetweenAnswers
        console.log(`current: ${currentTimestamp} vs last ${lastUserMessageTimestamp}. Diff: ${currentTimestamp - lastUserMessageTimestamp} and delay: ${questDelay}`)

        if (currentTimestamp - lastUserMessageTimestamp < questDelay) {
            await message.author.send("Not so fast Mortal. We don't like those in a hurry")
            return true
        }
        return false
    }
}

export default DelayAnswer