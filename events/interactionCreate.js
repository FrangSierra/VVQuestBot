import Event from "../core/Event.js";

class InteractionCreate extends Event {
    async run(interaction) {
        if (interaction.isCommand()) this.#handleSlashCommand(interaction)
        else if (interaction.isButton() || interaction.isSelectMenu()) this.#handleButton(interaction)
    }

    #handleSlashCommand(interaction) {
        console.log(`handling interaction: ${interaction.commandName} from user ${interaction.user?.username} has command`)
      //  if (!interaction.inGuild()) return interaction.reply("This command can only be used in a server")
        const slashcmd = this.client.getServerCommand(interaction.commandName)

        if (!slashcmd) {
            console.log("The given slash command doesnt exist")
            return
        }
        slashcmd.run(interaction)
    }

    #handleButton(interaction) {
        console.log(`handling interaction: ${interaction.customId} from user ${interaction.user?.username} has button`)
        const eventcmd = this.client.getButtonInteractionEvent(interaction.customId)

        if (!eventcmd) {
            console.log("The given event doesnt exist")
            return
        }
        eventcmd.run(interaction)
    }
}

export default InteractionCreate