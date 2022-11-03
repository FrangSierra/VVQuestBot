import Command from "../core/Command.js"

const HINT_COMMAND_TEXT = `*Stop asking for help*`

class Hint extends Command {
    async run(message, userData) {
        //This command is only for dm use
        if (message.guild) return

        if (userData.questIndex === -1 || userData.interactionIndex === -1) {
            await message.author.send("You are not running any quest Mortal. What kind of hints do you expect?")
            return
        }
        const currentInteraction = this.client.questManager.getQuestInteraction(userData.questIndex, userData.interactionIndex)
        //If interaction has no hints throw default message
        if (!currentInteraction.hints.length) {
            await message.author.send(HINT_COMMAND_TEXT)
        } else {
            const randomHint = currentInteraction.hints[~~(currentInteraction.hints.length * Math.random())]
            await message.author.send(`*${randomHint}*`)
        }
    }
}

export default Hint