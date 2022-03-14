const { Command } = require('discord.js-commando');
const parseFlags = require('../../util/parseFlags');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause-music',
      aliases: ['pause', 'hold', 'stop'],
      memberName: 'pause-music',
      group: 'music',
      description: 'Pause the current playing song.',
      guildOnly: true,
      args: [
        {
          key: "flags",
          type: "string",
          prompt: "",
          default: ""
        }
      ]
    });
  }

  async run(interaction, { flags }) {
    flags = parseFlags(flags);
    interaction.guild.jukebox.pause(interaction);
  }
};