const { Command } = require("discord.js-commando");
const getSongsFromInput = require("../../util/getSongsFromInput");

module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client, {
      name: "add-to-queue",
      aliases: ["add", "enqueue"],
      memberName: "add-to-queue",
      group: "music",
      description: "Add song to the queue.",
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
      args: [
        {
          key: "query",
          prompt: "What do you want to listen to?",
          type: "musicrequest",
        },
      ],
    });
  }

  async run(message, { query }) {
    const voiceChannel = message.member.voice.channel;
    let { input, flags } = query;
    input = input.trim();

    if (!voiceChannel) {
      message.say(
        "I can only play music in voice channels. Join a voice channel and try again."
      );
      return;
    }

    const songs = await getSongsFromInput(message, input);
    if (songs) {
      if (!message.guild.jukebox.queue.length) {
        message.guild.jukebox.enqueue(songs);
        message.guild.jukebox.play(message);
      } else {
        message.guild.jukebox.enqueue(songs);
      }
      message.say(`${songs.length ? "Songs" : "Song"} added to queue!`)
    }
  }
};
