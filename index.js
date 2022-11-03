import {Intents} from "discord.js"
import "dotenv/config"
import Bot from "./core/Bot.js"
import Keyv from "keyv";
import {SlashCommandStringOption} from "@discordjs/builders";

//Initialize memory storage. Use a databse in the future
const keyv = new Keyv();
//keyv.on('error', err => console.error('Keyv connection error:', err));

const client = new Bot({
    storage: keyv,
    owners: ["169562543293988866"],
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
    prefix: "!",
    partials: [
        'CHANNEL', // Required to receive DMs
    ]
})
client.loadEvents()
client.loadCommands()
client.loadServerCommands()
client.loadButtonInteractionEvents()

client.start(process.env.TOKEN)