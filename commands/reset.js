import Command from "../core/Command.js"
import UserData from "../core/UserData.js";
import {getTimestampInMilliseconds} from "../util/functions.js";

const RESET_COMMAND_TEXT = `The current quest cache has been deleted`

class Reset extends Command {
    async run(message, userData) {
        //This command is only for dm use
        if (message.guild) return
        //Set user data
        const newUserData = new UserData(userData.id, userData.tag, -1, -1, userData.lastMessageTimestamp)
        await this.client.storage.set(userData.id, JSON.stringify(newUserData))
        await message.author.send(RESET_COMMAND_TEXT)
    }
}

export default Reset