require("dotenv").config();
const YT = require("simple-youtube-api");
const Song = require("../classes/Song");
const youtube = new YT(process.env.YOUTUBE_KEY);
const { MessageEmbed } = require("discord.js");

const localData = {
  intro: {
    uri: "intro.wav",
    title: "Eberron Awaits Intro",
    thumbnail: null,
    duration: "00:38"
  },
  outro: {
    uri: "outro.wav",
    title: "Eberron Awaits Outro",
    thumbnail: null,
    duration: "00:38"
  }
}

module.exports = async function getSongsFromInput(interaction, input) {
  // TODO - 
  // - implement the vars thing for local files
  // - local db? sqlite?
  if (localData[input]) {
    const songData = localData[input];
    return [new Song(interaction.guild.jukebox, "file", songData)];
  } else if (
    input.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)
  ) {
    try {
      const playlist = await youtube.getPlaylist(input);
      if (playlist.length > 20) {
        interaction.reply("That's a long playlist! I'm just going to take the first 20 of those, if you don't mind.");
      }
      const videos = await playlist.getVideos(20);
      songs = videos.map((el) => {
        const video = el.fetch();
        let duration = parseDuration(video.duration);
        const songData = {
          uri: `https://www.youtube.com/watch?v=${video.raw.id}`,
          title: video.raw.snippet.title,
          thumbnail: video.thumbnails.high.url,
          duration
        };
        return new Song(interaction.guild.jukebox, "Youtube", songData);
      });
      return songs;
    } catch (err) {
      console.error(err);
      interaction.reply("Playlist is either private or it does not exist");
      return null;
    }
  } else if (input.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/)) {
    try {
      const video = await youtube.getVideo(input);
      let duration = parseDuration(video.duration);
      const songData = {
        uri: input,
        title: video.title,
        thumbnail: video.thumbnails.high.url,
        duration
      };
      return [new Song(interaction.guild.jukebox, "Youtube", songData)];
    } catch (err) {
      console.error(err);
      interaction.reply("I'm afraid something has gone wrong.");
      return null;
    }
  } else {
    try {
      const searchTerm = input;
      const videos = await youtube.searchVideos(searchTerm, 5);
      if (videos.length < 5) {
        interaction.reply(
          `I'm not finding too many videos when searching for ${searchTerm}...`
        );
        return null;
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
      var songEmbed = await interaction.reply({ embed });
      try {
        var response = await interaction.channel.awaitMessages(
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
        interaction.reply(
          "Please try again and enter a number between 1 and 5 or exit"
        );
        return null;
      }
      // if the user responded with 'exit', cancel the command
      if (response.first().content === "exit") {return songEmbed.delete()};
      try {
        // get video data from the API
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        songEmbed.delete();
        interaction.reply(
          "An error has occured when trying to get the video ID from youtube"
        );
        return null;
      }
      let duration = parseDuration(video.duration);
      const songData = {
        uri: `https://www.youtube.com/watch?v=${video.raw.id}`,
        title: video.title,
        thumbnail: video.thumbnails.high.url,
        duration
      };
      return [new Song(interaction.guild.jukebox, "Youtube", songData)];
    } catch (err) {
      console.error(err);
      if (songEmbed) {
        songEmbed.delete();
      }
      interaction.reply(
        "Something went wrong with searching the video you requested."
      );
      return null;
    }
  }
}


function parseDuration(duration) {
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
  if (result == "00:00") {
    return "Live Stream";
  }
  return result;
}