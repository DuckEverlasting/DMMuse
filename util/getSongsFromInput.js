require("dotenv").config();
const YT = require("simple-youtube-api");
const Song = require("../classes/Song");
const youtube = new YT(process.env.YOUTUBE_KEY);
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

const localData = {
    intro: {
        uri: "intro.wav",
        title: "Eberron Awaits Intro",
        thumbnail: null,
        duration: "00:38",
    },
    outro: {
        uri: "outro.wav",
        title: "Eberron Awaits Outro",
        thumbnail: null,
        duration: "00:38",
    },
};

module.exports = async function getSongsFromInput(discordObj, jukebox, input, successCallback, errorCallback) {
    // TODO -
    // - implement the vars thing for local files
    // - local db? sqlite?
    const isInteraction = discordObj.isCommand?.();
    if (localData[input]) {
        const songData = localData[input];
        if (isInteraction) {
            discordObj.deleteReply();
        }
        return successCallback([new Song(jukebox, "file", songData)]);
    } else if (
        input.match(
            /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
        )
    ) {
        try {
            const playlist = await youtube.getPlaylist(input);
            if (playlist.length > 20) {
                discordObj.channel.send(
                    "That's a long playlist! I'm just going to take the first 20 of those, if you don't mind."
                );
            }
            const videos = await playlist.getVideos(20);
            songs = videos.map((el) => {
                const video = el.fetch();
                let duration = parseDuration(video.duration);
                const songData = {
                    uri: `https://www.youtube.com/watch?v=${video.raw.id}`,
                    title: video.raw.snippet.title,
                    thumbnail: video.thumbnails.high.url,
                    duration,
                };
                return new Song(jukebox, "Youtube", songData);
            });
            if (isInteraction) {
                discordObj.deleteReply();
            }
            return successCallback(songs);
        } catch (err) {
            console.error(err);
            return errorCallback("Playlist is either private or it does not exist");
        }
    } else if (
        input.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/)
    ) {
        try {
            const video = await youtube.getVideo(input);
            let duration = parseDuration(video.duration);
            const songData = {
                uri: input,
                title: video.title,
                thumbnail: video.thumbnails.high.url,
                duration,
            };
            if (isInteraction) {
                discordObj.deleteReply();
            }
            return successCallback([new Song(jukebox, "Youtube", songData)]);
        } catch (err) {
            console.error(err);
            return errorCallback("I'm afraid something has gone wrong.");
        }
    } else {
        try {
            const searchTerm = input;
            const videos = await youtube.searchVideos(searchTerm, 10);
            if (!videos.length) {
                return errorCallback(`I'm not finding any videos when searching for ${searchTerm}...`);
            }
            const optionList = [];
            videos.forEach((video, i) => {
                optionList.push({ label: video.title, value: `${i}` });
            });
            optionList.push({ label: "(None of these)", value: "none" });
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId("select-song")
                    .setPlaceholder("Choose one")
                    .addOptions(optionList)
            );

            if (isInteraction) {
                await discordObj.editReply({
                    content: `Top ${optionList.length - 1} results for "${searchTerm}":`,
                    components: [row],
                    ephemeral: true,
                });
            } else {
                await discordObj.channel.send({
                    content: `Top ${optionList.length - 1} results for "${searchTerm}":`,
                    components: [row],
                    ephemeral: true,
                });
            }
            let collector = discordObj.channel.createMessageComponentCollector(
                { componentType: "SELECT_MENU", customId: "select-song" }
            );
            collector.on('collect', async msg => {
                if (isInteraction) {
                    msg.deleteReply();
                }
                const choice = msg.values[0];
                if (choice === "none") {
                    return
                }
                try {
                    // get video data from the API
                    var video = await youtube.getVideoByID(
                        videos[parseInt(choice)].id
                    );
                } catch (err) {
                    console.error(err);
                    discordObj.channel.send(
                        "An error has occured when trying to get the video ID from youtube"
                    );
                    return null;
                }
                let duration = parseDuration(video.duration);
                const songData = {
                    uri: `https://www.youtube.com/watch?v=${video.raw.id}`,
                    title: video.title,
                    thumbnail: video.thumbnails.high.url,
                    duration,
                };
                return successCallback([new Song(jukebox, "Youtube", songData)]);
            });
        } catch (err) {
            console.error(err);
            return errorCallback("Something went wrong with searching the video you requested.");
        }
    }
};

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
