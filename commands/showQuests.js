import Command from "../core/Command.js"
import {MessageAttachment} from "discord.js";
import UserData from "../core/UserData.js";
import {getTimestampInMilliseconds} from "../util/functions.js";

const INFO_COMMAND_TEXT = `Welcome ta tha Frostfire Tavern mortal!\n
I'm Dur an' this Fella at my side be me brother Din. The pleasure be ours!
Tell us, how can we help ye?\n
ye wanna hear aboot old quests an' tales. You looking for adventure. Dont ye?
We know a lot o' tales across tha verse. Which one be ye interested in?`

class ShowQuests extends Command {
    async run(message, userData) {
        //This command is only for dm use
        if (true) return //Disable for now and force using /startQuest
        const user = message.author
        const availableQuests = this.client.questManager.quests

        if (userData.questIndex > -1) {
            await user.send(`You are in the middle of the quest: **${availableQuests[userData.questIndex].title}**. User !reset if you wanna drop it and start again`)
            return
        }

        try {
            const filter = (reaction, user) => {
                return availableQuests.some((quest) => quest.emojiId === reaction.emoji.identifier)
            };
            const questLabelEntries = availableQuests.map((quest) => `${quest.emojiMenu} -- ${quest.title}`)
            const answer = `*${INFO_COMMAND_TEXT}*\n\n**${questLabelEntries.join("\n")}**`;
            const messageAnswer = await user.send(answer)

            const collector = messageAnswer.createReactionCollector({filter, time: 600000}); //3 min or more?

            collector.on('collect', (reaction, user) => {
                const emojiId = reaction.emoji.identifier;
                const emojiName = reaction.emoji.name;
                console.log(`Collected ${emojiName} from ${user.tag}`);

                if (availableQuests.some((quest) => quest.emojiId === emojiId)) {
                    try {
                        //Start quest
                        const choosenQuestIndex = availableQuests.findIndex(quest => quest.emojiId === emojiId)
                        const quest = availableQuests[choosenQuestIndex]
                        const interactionIndex = 0
                        const currentInteraction = quest.interactions[interactionIndex]

                        //Set user data
                        const newUserData = new UserData(userData.userId, userData.userTag, choosenQuestIndex, interactionIndex, getTimestampInMilliseconds())
                        this.client.storage.set(userData.userId, JSON.stringify(newUserData))

                        //Send first interaction and images if needed
                        user.send("--------------------------------------------------------------------------------------------")
                        user.send(currentInteraction.message)

                        //const interactionImages = currentInteraction.imgs
                        //const attachments = interactionImages.length > 0 ? interactionImages.map((item => new MessageAttachment(item))) : []
                        //await user.send({content: `*${currentInteraction.message}*`, files: attachments})

                        //Stop collector
                        collector.stop(`Emoji collected by the user. Starting quest ${quest.title}`)
                    } catch (e) {
                        console.log(`Error sending a message to user ${user.tag}`);
                    }
                } else {
                    //Remove emoji
                }
            });

            collector.on('end', collected => {
                //Delete the chooser menu after collect a single valid item
                //messageAnswer.delete()
            });

        } catch (e) {
            console.log(`Error executing command info for user ${user.tag}`);
        }
    }
}

export default ShowQuests