import QuestMessageInterceptor from "../../core/QuestMessageInterceptor.js"
import UserData from "../../core/UserData.js";
import {getTimestampInMilliseconds} from "../../util/functions.js";

class MissionComplete extends QuestMessageInterceptor {
	async run(message, userData) {
        const questIndex = userData.questIndex
        //Ignore this interceptor if the user has not started any quest
        if (questIndex === -1) return false

        const currentQuest = this.client.questManager.getQuest(questIndex)
        const interactionIndex = userData.interactionIndex

        if (currentQuest) {
            if (interactionIndex >= currentQuest.interactions.length -1){
                //Update user value after handle quest completed
                const updatedUserData = new UserData(userData.userId, userData.userTag, -1, -1, getTimestampInMilliseconds())
                await this.client.storage.set(userData.id, JSON.stringify(updatedUserData))
                await message.author.send("Thanks for participating in the quest! Hope you had a good ride. Your current quest progress have been deleted. You can start a new quest using !info")
                return true
            }
        }
        return false
	}
}

export default MissionComplete