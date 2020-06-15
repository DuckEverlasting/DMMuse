require("dotenv").config();

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const YT = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YT(process.env.YOUTUBE_KEY);

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play-music",
      aliases: ["play"],
      memberName: "play-music",
      group: "music",
      description:
        'Play any song or playlist from Youtube. To use saved variables, surround them in greater/less than brackets like <this>. Flags are added at the end with the ">" symbol.',
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
    const { html, flags } = query;

    if (!voiceChannel) {
      return message.say(
        "I can only play music in voice channels. Join a voice channel and try again."
      );
    }

    if (
      html.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)
    ) {
      try {
        const playlist = await youtube.getPlaylist(html);
        if (playlist.length > 20) {
          message.say("That's a long playlist! I'm just going to take the first 20 of those, if you don't mind.");
        }
        const videos = await playlist.getVideos(20);
        videos.forEach(async (el) => {
          const video = await el.fetch();
          let duration = this.parseDuration(video.duration);
          if (duration == "00:00") {
            duration = "Live Stream";
          }
          const song = {
            url: `https://www.youtube.com/watch?v=${video.raw.id}`,
            title: video.raw.snippet.title,
            thumbnail: video.thumbnails.high.url,
            duration,
            voiceChannel,
            flags,
          };
          message.guild.musicData.queue.push(song);
        });
        console.log(message.guild.musicData.queue)

        if (message.guild.musicData.isPlaying == false) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(
            `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
          );
        }
      } catch (err) {
        console.error(err);
        return message.say("Playlist is either private or it does not exist");
      }
    }

    if (html.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/)) {
      try {
        const video = await youtube.getVideo(html);
        let duration = this.parseDuration(video.duration);
        if (duration == "00:00") {
          duration = "Live Stream";
        }
        const song = {
          url: html,
          title: video.title,
          thumbnail: video.thumbnails.high.html,
          duration,
          voiceChannel,
          flags,
        };
        message.guild.musicData.queue.push(song);
        if (
          message.guild.musicData.isPlaying == false ||
          typeof message.guild.musicData.isPlaying == "undefined"
        ) {
          message.guild.musicData.isPlaying = true;
          return this.playSong(message.guild.musicData.queue, message);
        } else if (message.guild.musicData.isPlaying == true) {
          return message.say(
            `:musical_note: ${song.title} :musical_note: has been added to queue`
          );
        }
      } catch (err) {
        console.error(err);
        return message.say("I'm afraid something has gone wrong.");
      }
    }

    try {
      const searchTerm = html;
      const videos = await youtube.searchVideos(searchTerm, 5);
      if (videos.length < 5) {
        return message.say(
          `I'm not finding too many videos when searching for ${searchTerm}...`
        );
      }
      const optionList = [];
      videos.forEach((video, i) => {
        optionList.push(`${i + 1}: ${video.title}`);
      });
      optionList.push("none");
      const embed = new MessageEmbed()
        .setColor("#fafa32")
        .setTitle('Comment the number of the song you want (or say "none" to back out)')
        .addField("Song 1", optionList[0])
        .addField("Song 2", optionList[1])
        .addField("Song 3", optionList[2])
        .addField("Song 4", optionList[3])
        .addField("Song 5", optionList[4])
        .addField("None", "none");
      var songEmbed = await message.say({ embed });
      try {
        var response = await message.channel.awaitMessages(
          (msg) =>
            (msg.content > 0 && msg.content < 6) || msg.content === "none",
          {
            max: 1,
            maxProcessed: 1,
            time: 60000,
            errors: ["time"],
          }
        );
        var videoIndex = parseInt(response.first().content);
      } catch (err) {
        console.error(err);
        songEmbed.delete();
        return message.say(
          "Please try again and enter a number between 1 and 5 or exit"
        );
      }
      // if the user responded with 'exit', cancel the command
      if (response.first().content === "exit") {return songEmbed.delete()};
      try {
        // get video data from the API
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        songEmbed.delete();
        return message.say(
          "An error has occured when trying to get the video ID from youtube"
        );
      }
      let duration = this.parseDuration(video.duration);
      if (duration == "00:00") duration = "Live Stream";
      const song = {
        url: `https://www.youtube.com/watch?v=${video.raw.id}`,
        title: video.title,
        thumbnail: video.thumbnails.high.url,
        duration,
        voiceChannel,
        flags,
      };
      console.log("URL: ", song.url)

      if (flags.has("now")) {
        message.guild.musicData.queue.unshift(song);
      } else {
        message.guild.musicData.queue.push(song);
      }

      if (message.guild.musicData.isPlaying == false || flags.has("now")) {
        message.guild.musicData.isPlaying = true;
        songEmbed.delete();
        this.playSong(message.guild.musicData.queue, message);
      } else if (message.guild.musicData.isPlaying == true) {
        songEmbed.delete();
        return message.say(
          `:musical_note: ${song.title} :musical_note: has been added to queue`
        );
      }
    } catch (err) {
      console.error(err);
      if (songEmbed) {
        songEmbed.delete();
      }
      return message.say(
        "Something went wrong with searching the video you requested."
      );
    }
  }

  playSong(queue, message) {
    let voiceChannel;
    const currentSong = queue[0];
    console.log("PLAYING: ", currentSong);
    queue[0].voiceChannel
      .join()
      .then((connection) => {
        const dispatcher = connection
          .play(
            ytdl(queue[0].url, {
              quality: "highestaudio",
              highWaterMark: 1024 * 1024 * 10,
            })
          )
          .on("start", () => {
            message.guild.musicData.songDispatcher = dispatcher;
            dispatcher.setVolume(message.guild.musicData.volume);
            voiceChannel = currentSong.voiceChannel;
            if (!currentSong.flags.has("played")) {
              const videoEmbed = new MessageEmbed()
                .setThumbnail(currentSong.thumbnail)
                .setColor("#fafa32")
                .addField("Now Playing:", currentSong.title)
                .addField(
                  "Duration:",
                  message.guild.musicData.loop === "current"
                    ? "On Loop"
                    : currentSong.duration
                );
              if (queue[1] && message.guild.musicData.loop !== "current") {
                videoEmbed.addField("Next Song:", queue[1].title);
              }
              message.say(videoEmbed);
            }
            currentSong.flags.add("played");
            queue.shift();
            return queue;
          })
          .on("finish", () => {
            if (message.guild.musicData.shuffle) {
              queue
            }
            if (message.guild.musicData.loop === "current") {
              queue.unshift(currentSong);
            } else if (message.guild.musicData.loop === "all") {
              currentSong.flags.delete("played");
              queue.push(currentSong);
            }
            if (queue.length >= 1) {
              return this.playSong(queue, message);
            } else {
              message.guild.musicData.isPlaying = false;
              return voiceChannel.leave();
            }
          })
          .on("error", (e) => {
            message.say(
              "Something has gone wrong. I cannot play the next song. I am ashamed."
            );
            message.guild.musicData.queue.length = 0;
            message.guild.musicData.isPlaying = false;
            message.guild.musicData.nowPlaying = null;
            console.error(e);
            return voiceChannel.leave();
          });
      })
      .catch((e) => {
        console.error(e);
        return voiceChannel.leave();
      });
  }

  parseDuration(duration) {
    const result = `
      ${duration.hours ? duration.hours + ":" : ""}
      ${duration.minutes ? duration.minutes : "00"}:
      ${
        duration.seconds < 10
          ? "0" + duration.seconds
          : duration.seconds
          ? duration.seconds
          : "00"
      }
    `;
    return result;
  }
};
