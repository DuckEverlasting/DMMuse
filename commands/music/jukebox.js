const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageComponentInteraction } = require("discord.js");
const getEmogiId = require('../../util/getEmogiId');

module.exports = {
    name: "jukebox",
    slashCommand: new SlashCommandBuilder()
        .setName("jukebox")
        .setDescription("Jukebox interface."),
    run: async function(interaction, state) {
        let jukebox;
        await interaction.deferReply();
        try {
            jukebox = getJukebox(interaction, state)
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        if (!jukebox.queue?.length) {
            return interaction.editReply(
                'Nothing in the queue!'
            );
        }
        
        await interaction.editReply({
            content: `Sending jukebox...`,
            ephemeral: true,
        });

        const dmChannel = await interaction.user.createDM();
        const queueMessage = await dmChannel.send({
            embeds: [ jukebox.getQueueInfo().embed ]
        })
        const uiMessage = await dmChannel.send({
            components: getButtons(jukebox)
        })

        interaction.client.on('interactionCreate', async bInt => {
            if (bInt.channel != dmChannel || !bInt.isButton()) {
                return;
            }
            switch (bInt.customId) {
                case "play/pause":
                    await jukebox.pauseResume(null, { quiet: true });
                    break;
                case "loop":
                    await jukebox.setLoop('toggle')
                    break;
                case "shuffle":
                    jukebox.shuffle()
                    break;
                case "skip":
                    jukebox.skip()
                    break;
                default: break;
            }
            bInt.update({ components: getButtons(jukebox) })
        });

        jukebox.on('queueChange', () => {
            queueMessage.edit({ embeds: [ jukebox.getQueueInfo().embed ] });
        })
    }
}

function getButtons(jukebox) {
    const row1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('play/pause')
            .setEmoji('⏯️')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('loop')
            .setLabel(`🔁: ${jukebox.loop}`)
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('shuffle')
            .setEmoji('🔀')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('skip')
            .setEmoji('⏭')
            .setStyle('SECONDARY'),
    );  
    return [row1];
}