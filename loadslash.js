const Discord = require("discord.js")
require("dotenv").config()
const fs = require("fs");

const quest = JSON.parse(fs.readFileSync(`./quests/memesOfBoreas.json`, "utf-8"))

const client = new Discord.Client({
    intents: [
          "GUILDS",
          "GUILD_MESSAGES"
    ]
})

client.slashcommands = new Discord.Collection()

let bot = {
    client,
    quest: quest
}

client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, false)

const guildId = "1036578630219874326"

client.on("ready", async () => {
    console.log(`Loading ${client.slashcommands.size} slash commands`)

    const guild = client.guilds.cache.get(guildId)
    if (!guild)
        console.error("Target Guild not found")

    await guild.commands.set([...client.slashcommands.values()])
    console.log("Finished")
    process.exit(0)
})

client.login(process.env.TOKEN)