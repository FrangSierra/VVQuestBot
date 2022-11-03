import Event from "../core/Event.js"
import UserData from "../core/UserData.js";
import {getTimestampInMilliseconds} from "../util/functions.js";

class MessageCreate extends Event {
    async run(message) {

        //return if the message is from the bot
        if (message.author.bot) return

        //Init user data if needed
        const currentUserData = await this.client.storage.get(message.author.id)
        if (!currentUserData) {
            console.log(`Userdata not exist. Adding it`)
            const defaultUserData = new UserData(message.author.id, message.author.username, -1, -1, getTimestampInMilliseconds())
            await this.client.storage.set(message.author.id, JSON.stringify(defaultUserData))
        }

        const rawUpdatedUserData = await this.client.storage.get(message.author.id)
        const userData = await UserData.fromJson(JSON.parse(rawUpdatedUserData))
        const containPrefix = message.content.startsWith(this.client.prefix)

        //Manage the message properly if its a dm and the user is already on the quest
        if (!containPrefix && !message.guild) {
            const userIsParticipatingInQuest = userData.questIndex > -1

            if (userIsParticipatingInQuest) {
                if (await this.client.questManager.handleMessageForQuest(message, userData)) return
            } else {
                //Allow commands ?
                //  message.reply("Sorry mortal. Right now It looks you are not in any active quest. Check VV discord for more information")
            }
        }

        //If the message was not managed has quest and have no prefix ignore it
        if (!containPrefix) return

        let command = this.client.getCommand(message.content.replace(this.client.prefix, ""))
        //Dev check?
        if (command) command.run(message, userData)
    }
}

export default MessageCreate