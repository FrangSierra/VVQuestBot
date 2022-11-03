class QuestInteraction {
    static fromJson(json) {
        return new QuestInteraction(
            json.message,
            json.imgs ? json.imgs : [],
            json.requireAnswer ? json.requireAnswer : true,
            json.hints ? json.hints : [],
            json.customSuccessTexts ? json.customSuccessTexts : [],
            json.customFailureTexts ? json.customFailureTexts : [],
            json.possibleAnswers ? json.possibleAnswers.map(answer => answer.toLowerCase()) : []
        )
    }

    constructor(message, imgs, requireAnswer, hints, customSuccessTexts, customFailureTexts, possibleAnswers) {
        this.message = message
        this.imgs = imgs
        this.requireAnswer = requireAnswer
        this.hints = hints
        this.customSuccessTexts = customSuccessTexts
        this.customFailureTexts = customFailureTexts
        this.possibleAnswers = possibleAnswers
    }

    getRandomSuccessText() {
        return this.customSuccessTexts[~~(this.customSuccessTexts.length * Math.random())];
    }

    getRandomFailureText() {
        return this.customFailureTexts[~~(this.customFailureTexts.length * Math.random())];
    }
}

export default QuestInteraction