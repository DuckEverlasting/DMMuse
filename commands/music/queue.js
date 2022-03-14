const { Command } = require('discord.js-commando');
const { interactionEmbed } = require('discord.js');

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue-info',
      aliases: ['song-list', 'song-info', 'queue'],
      group: 'music',
      memberName: 'queue-info',
      guildOnly: true,
      description: 'Displays the song queue'
    });
  }

  run(interaction) {
    if (interaction.guild.jukebox.queue.length == 0)
      return interaction.reply('There are no songs in queue!');
    const titleArray = interaction.guild.jukebox.queue.map(song => song.title);
    var queueEmbed = new MessageEmbed()
      .setColor('#fafa32')
      .setTitle('Current Music Queue');
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return interaction.reply(queueEmbed);
  }
};