const { MessageEmbed } = require("discord.js");
const FileResource = require("./FileResource");
const YoutubeResource = require("./YoutubeResource");

module.exports = class Song {
  constructor(jukebox, type, data) {
    this.jukebox = jukebox;
    this.title = data.title;
    this.thumbnail = data.thumbnail;
    this.duration = data.duration;
    this.videoEmbed = new MessageEmbed()
      .setThumbnail(data.thumbnail)
      .setColor("#fafa32")
      .addField("Now Playing:", data.title)
      .addField("Duration:", data.duration);
    this.resource = type === "file" ? new FileResource(data.uri) : new YoutubeResource(data.uri);
  }
  getVideoEmbed() {
    const embed = new MessageEmbed(this.videoEmbed);
    const nextSong = this.jukebox.queue[1];
    if (nextSong) {
      embed.addField("Next Song:", nextSong.title);
    }
    return embed;
  }
  getResource() {
    return this.resource.getResource();
  }
};
