import QuestInteraction from "./QuestInteraction.js";

class Quest {
    static fromJson(json) {
        return new Quest(
            json.title,
            json.description,
            json.emojiMenu,
            json.emojiId,
            json.allowSkip ? json.allowSkip : false,
            json.interactions ? json.interactions.map(interaction => QuestInteraction.fromJson(interaction)) : [],
            json.questImage ? json.questImage : null,
            json.enableSuccessMessages ? json.enableSuccessMessages : false,
            json.enableFailureMessages ? json.enableFailureMessages : true,
            json.delayBetweenAnswers ? json.delayBetweenAnswers : 10000
        )
    }

    constructor(title,
                description,
                emojiMenu,
                emojiId,
                allowSkip,
                interactions,
                questImage,
                enableSuccessMessages,
                enableFailureMessages,
                delayBetweenAnswers) {
        this.title = title
        this.description = description
        this.emojiMenu = emojiMenu
        this.emojiId = emojiId
        this.allowSkip = allowSkip
        this.interactions = interactions
        this.questImage = questImage
        this.enableSuccessMessages = enableSuccessMessages
        this.enableFailureMessages = enableFailureMessages
        this.delayBetweenAnswers = delayBetweenAnswers
    }
}

export default Quest