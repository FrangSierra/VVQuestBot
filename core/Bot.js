import {Client, Collection} from "discord.js"
import QuestManager from "./QuestManager.js";
import {getFiles} from "../util/functions.js";

class Bot extends Client {
    constructor(args) {
        super(args)

        this.prefix = args.prefix
        this.storage = args.storage
        this.admins = args.admins
        this.commands = new Collection()
        this.serverCommands = new Collection()
        this.buttonInteractionEvents = new Collection()
        this.events = new Collection()
        this.questManager = new QuestManager(this)
    }

    async start(token) {
        await this.questManager.init()
        console.log(`${this.commands.size} commands were loaded`)
        console.log(`${this.events.size} events were loaded`)
        console.log(`${this.serverCommands.size} server commands were loaded`)
        console.log(`${this.buttonInteractionEvents.size} button events were loaded`)
        await super.login(token)
    }

    loadEvents() {
        const eventFiles = getFiles("./events/", ".js")

        eventFiles.forEach(async (eventFileName) => {
            const eventName = eventFileName.split(".js")[0]
            const Event = (await import(`../events/${eventFileName}`)).default
            const event = new Event(this, eventName)
            event.startListener()
            this.events.set(eventName, event)
        })
    }

    loadCommands() {
        const commandFiles = getFiles("./commands/", ".js")

        commandFiles.forEach(async (commandFileName) => {
            const commandName = commandFileName.split(".js")[0]
            const Command = (await import(`../commands/${commandFileName}`)).default
            const command = new Command(this, commandName)
            this.commands.set(commandName, command)
        })
    }

    loadServerCommands() {
        const serverCommandFiles = getFiles("./server_commands/", ".js")

        serverCommandFiles.forEach(async (serverCommandFileName) => {
            const commandName = serverCommandFileName.split(".js")[0]
            console.log(`Loading server command /${commandName}`)
            const ServerCommand = (await import(`../server_commands/${serverCommandFileName}`)).default
            const command = new ServerCommand(this, commandName)
            this.serverCommands.set(commandName, command)
        })
    }

    loadButtonInteractionEvents() {
        const buttonInteractionEvents = getFiles("./button_interactions/", ".js")

        buttonInteractionEvents.forEach(async (eventFileName) => {
            const interactionName = eventFileName.split(".js")[0]
            console.log(`Loading interaction  /${interactionName}`)
            const InteractionEvent = (await import(`../button_interactions/${eventFileName}`)).default
            const interaction = new InteractionEvent(this, interactionName)
            this.buttonInteractionEvents.set(interactionName, interaction)
        })
    }

    getCommand(commandName) {
        return this.commands.get(commandName)
    }

    getServerCommand(commandName) {
        return this.serverCommands.get(commandName)
    }

    getButtonInteractionEvent(interactionEvent) {
        return this.buttonInteractionEvents.get(interactionEvent)
    }
}

export default Bot