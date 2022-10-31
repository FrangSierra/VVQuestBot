const handleQuest = async (bot, message) => {
    const {quest, storage} = bot
    const user = message.author
    const currentQuestStatus = await storage.get(user.id)

    console.log(`New Message ${message.content} from ${user.tag}`)
    
    if (currentQuestStatus.questStatus >= quest.riddles.length - 1) {
        await message.reply("Thanks for participating! Join to the next quest whenever its announced")
        return
    }

    if (message.content == quest.riddles[currentQuestStatus.questStatus].answer) {
        await message.reply("Right answer Mortal! Next move to the next part of the riddle")
        const updatedIndex = currentQuestStatus.questStatus + 1
        await storage.set(user.id, {"questStatus": updatedIndex})
        await user.send(quest.riddles[updatedIndex].message)
    } else {
        await message.reply("Wrong. Why Gods gave you human the gift of life if you can barely answer this")
    }
}

module.exports = {
    handleQuest
}