const { Command } = require('discord.js-commando');
const parseFlags = require('../../util/parseFlags');

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume-music',
      aliases: ['resume', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Resume the current paused song',
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

  async run(message, { flags }) {
    flags = parseFlags(flags);
    message.guild.jukebox.resume(message);
  }
};