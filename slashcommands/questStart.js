const {MessageEmbed, MessageAttachment} = require("discord.js");
const run = async (bot, interaction) => {

    const {client, quest, storage} = bot

    if (interaction.options.devOnly && !client.owners.includes(interaction.member.id)) {
        return interaction.reply("This command is only available to the bot admins")
    }

    // start
    try {
        const filter = (reaction, user) => {
            return reaction.emoji.name === '🔥';
        };

        console.log(client.data)
        const message = await interaction.channel.send(quest.intro)

        const collector = message.createReactionCollector({filter, time: 600000});

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (reaction.emoji.name === '🔥') {
                try {
                    storage.set(user.id, {"questStatus": 0})
                    user.send(quest.riddles[0].message)

                    const img = quest.riddles[0].img
                    img.forEach((item => {
                        if (item) {
                            const attachment = new MessageAttachment(item.url)
                            user.send({files: [attachment]})
                        }
                    }))
                } catch (e) {
                    console.log(`Error sending a message to user ${user.tag}`);
				}
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });

        return interaction.reply({
            content: 'Quest message have started. Those users who react with :fire: will receive a DM to start with the quest flow!',
            ephemeral: true
        });
    } catch (e) {
        if (e) {
            console.error(e)
            return interaction.reply(`Failed to start quest`)
        }
    }
}

module.exports = {
    name: "startquest",
    description: "Starts the Riddle",
    perms: [],
    options: [],
    devOnly: true,
    run,
}