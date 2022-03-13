const { Command } = require("discord.js-commando");

module.exports = class ShuffleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle-music",
      aliases: ["shuffle"],
      memberName: "shuffle-music",
      group: "music",
      description: "Shuffles songs in the current music queue.",
      guildOnly: true
    });
  }
  
  run(message) {
    if (message.guild.jukebox.queue.length == 0)
      return message.say('There are no songs in queue!');
    function shuffleInPlace(array) {
      for (let i = 0; i < array.length; i++) {
        let rand = Math.floor(Math.random() * array.length);
        let placeholder = array[i];
        array[i] = array[rand];
        array[rand] = placeholder;
      }
    }

    shuffleInPlace(message.guild.jukebox.queue)

    return message.say(`Queue shuffled`);
  }
};
