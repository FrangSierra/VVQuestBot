import Event from "../core/Event.js";
import {SlashCommandBuilder} from "@discordjs/builders"

class Ready extends Event {
    async run() {
        const guildId = "TBD"
        const guild = this.client.guilds.cache.get(guildId)
        let commands
        if (guild) {
            commands = guild.commands
        } else {
            commands = this.client.application?.commands
        }

        const clientCommands = Array.from(this.client.serverCommands, ((entry, index) => {
            return new SlashCommandBuilder()
                .setName(entry[0])
                .setDescription('Choose a quest to run on Vulcanverse')
        }))

        clientCommands.forEach(command => {
                commands?.create(command)
                console.log(`Command ${command.name} loaded`)
            }
        )
    }
}

export default Ready