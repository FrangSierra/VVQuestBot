const Discord = require("discord.js")
require("dotenv").config()
const Keyv = require('keyv');
const fs = require("fs");

const quest = JSON.parse(fs.readFileSync(`./quests/memesOfBoreas.json`, "utf-8"))

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "DIRECT_MESSAGES"
    ],
    partials: [
        'CHANNEL', // Required to receive DMs
    ]
})

const keyv = new Keyv();

keyv.on('error', err => console.error('Keyv connection error:', err));

let bot = {
    client,
    prefix: "!",
    owners: ["169562543293988866"],
    storage: keyv,
    quest: quest
}

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashcommands = new Discord.Collection()
client.buttons = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadButtons = (bot, reload) => require("./handlers/buttons")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)
client.loadButtons(bot, false)

module.exports = bot

client.login(process.env.TOKEN)