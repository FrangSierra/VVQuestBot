import Quest from "./Quest.js";
import fs from "fs"
import DelayAnswer from "../interceptors/quests/delayAnswer.js";
import MissionComplete from "../interceptors/quests/missionComplete.js";
import HandleAnswer from "../interceptors/quests/handleAnswer.js";
import {getFiles, getTimestampInMilliseconds} from "../util/functions.js";
import {
    INTERCEPTOR_LOW_PRIORITY,
    INTERCEPTOR_HIGH_PRIORITY,
    INTERCEPTOR_MEDIUM_PRIORITY
} from "./QuestMessageInterceptor.js";

class QuestManager {
    constructor(client) {
        this.client = client
        this.defaultSuccessMessages = ["You're a smart one, that is correct!", "Your knowledge exceeds that of the great Neswulf, master of lore! \nWell done mortal!", "Jamie would be proud, congratulations!"]
        this.defaultFailureMessages = ["You might want to reconsider you answer, mortal.", "You've been spending too much time at the Wineries my friend, try again.", "Hmm, it seems my goat may well be smarter than you, try again"]
        this.interceptors = []
        this.quests = []
    }

    async init() {
        console.log(`Loading manager quests`)
        this.interceptors = this.loadInterceptors().sort((a, b) => b.priority - a.priority) //sort by priority
        this.quests = this.#retrieveQuests()
        console.log(`Manager quests loaded with ${this.quests.size} quests`)
    }

    loadInterceptors() {
        return [
            new DelayAnswer(this.client, INTERCEPTOR_MEDIUM_PRIORITY),
            new MissionComplete(this.client, INTERCEPTOR_HIGH_PRIORITY),
            new HandleAnswer(this.client, INTERCEPTOR_LOW_PRIORITY)
        ]
    }

    #retrieveQuests() {
        return getFiles("./resources/quests/", ".json").map((questFileName) => {
            try {
                console.log(`loading quest from file: ${questFileName}`)
                const json = JSON.parse(fs.readFileSync(`./resources/quests/${questFileName}`, "utf-8"))
                const quest = Quest.fromJson(json);
                console.log(`Quest ${quest.title} loaded`)
                return quest
            } catch (e) {
                console.log(`There was an error loading the quest ${questFileName} : ${e}`)
            }
        })
    }

    async handleMessageForQuest(message, userData) {
        console.log(`handling message: ${message.content} from user ${userData.userTag} for quest ${this.quests[userData.questIndex].title}`)
        for (const interceptor of this.interceptors) {
            //console.log(`Interceptor: ${interceptor.constructor.name}`)
            const intercepted = await interceptor.run(message, userData)
            if (intercepted) return true
        }
        return false
    }

    getRandomSuccessText() {
        return this.defaultSuccessMessages[~~(this.defaultSuccessMessages.length * Math.random())];
    }

    getRandomFailureText() {
        return this.defaultFailureMessages[~~(this.defaultFailureMessages.length * Math.random())];
    }

    getQuestInteraction(questIndex, interactionIndex) {
        return this.quests[questIndex].interactions[interactionIndex]
    }

    getQuest(questIndex) {
        return this.quests[questIndex]
    }
}

export default QuestManager
