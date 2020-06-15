const { Command } = require("discord.js-commando");

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remove-track",
      aliases: ["remove-song", "remove"],
      memberName: "remove-track",
      group: "music",
      description: "Remove track at specified index from the song queue",
      guildOnly: true,
      args: [
        {
          key: "target",
          type: "integer",
          prompt: "Which song would you like to remove?"
        }
      ]
    });
  }
  
  async run(message, { target }) {
    if (message.guild.musicData.queue.length == 0)
      return message.say('There are no songs in queue!');
    
    message.guild.musicData.queue.splice(target, 1)
    return message.say('Song removed');
  }
};
