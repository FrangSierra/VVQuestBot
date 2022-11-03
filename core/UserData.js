class UserData {

    static fromJson(json) {
        return new UserData(
            json.userId,
            json.userTag,
            json.questIndex > -1 ? json.questIndex : -1,
            json.interactionIndex > -1 ? json.interactionIndex : -1,
            json.lastMessageTimestamp ? json.lastMessageTimestamp : -1)
    }

    constructor(userId, userTag, questIndex, interactionIndex, lastMessageTimestamp) {
        this.userId = userId
        this.userTag = userTag
        this.questIndex = questIndex
        this.interactionIndex = interactionIndex
        this.lastMessageTimestamp = lastMessageTimestamp
    }
}

export default UserData