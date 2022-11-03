import Command from "../core/Command.js"

const ABOUT_COMMAND_TEXT = `**--------------------------------------------------------------------------------------------**
Thank you for getting interested on the bot Mortal!
Check out the real Frostfire Tavern and throw an appreciation you can go to the plots #1755 & #1754 from the verse.

You can find the code of the bot on https://github.com/FrangSierra/VVQuestBot/ feel free to do pull requests or request features.

If you want to submit a quest to the bot just do a pull request to the repository adding the .JSON file required under ./resources/quests or find me
the Vulcanverse Discord has Durdin#5634.

If you wanna support the owner feel free to throw a tip to the **POLYGON** wallet **0x6eF3Ef4bB23039f7482775E7Cfb99211deb7289F**
**--------------------------------------------------------------------------------------------**
`

class About extends Command {
    async run(message, userData) {
        //This command is only for dm use
        if (message.guild) return
        message.reply({content: ABOUT_COMMAND_TEXT, ephemeral: true})
    }
}

export default About