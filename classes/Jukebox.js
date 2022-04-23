const Song = require("../classes/Song");
const { MessageEmbed } = require("discord.js");
const {
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    getVoiceConnection,
    NoSubscriberBehavior,
} = require("@discordjs/voice");
const fade = require("../util/fadeMusic");
const shuffleInPlace = require("../util/shuffleInPlace");
const getVoiceChannel = require("../util/getVoiceChannel");

module.exports = class Jukebox {
    constructor() {
        this.queue = [];
        this.playOrder = [];
        this.isBusy = false;
        this.volume = 0.25;
        this.loop = "none";
        // this.shuffle = false;
        this.busy = false;
        this.currentVoiceChannel = null;
        this.currentTextChannel = null;
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.silenceNextPlay = false;
        this.subscriptions = {
            play: [],
            queueChange: []
        }

        this.player.on(AudioPlayerStatus.Playing, async () => {
            await this.onPlay();
            if (!this.silenceNextPlay) {
                this.currentTextChannel?.send({ embeds: [this.queue[0].getVideoEmbed()] });
            } else {
                this.silenceNextPlay = false;
            }
        });

        this.player.addListener("stateChange", (prev, curr) => {
            if (!this.currentVoiceChannel) {
                return;
            }
            if (prev.status && curr.status == AudioPlayerStatus.Idle) {
                this.updateQueue();
                if (this.queue.length >= 1) {
                    return this.play(this.currentVoiceChannel);
                } else {
                    return this.getConnection(this.currentVoiceChannel).destroy();
                }
            }
        });

        this.player.on("error", (e) => {
            this.handleError(e);
            if (!this.currentVoiceChannel) {
                return;
            }
            this.updateQueue();
            if (this.queue[0]) {
                return this.play(voiceChannel);
            } else {
                return this.getConnection(voiceChannel).destroy();
            }
        });
    }

    on(eventName, callback) {
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName].push(callback);
        } else {
            throw new Error(`Jukebox has no event named "${eventName}."`);
        }
    }

    off(eventName, callback) { 
        if (this.subscriptions[eventName]) {
            this.subscriptions[eventName] = this.subscriptions[eventName].filter(cb => cb !== callback);
        } else {
            throw new Error(`Jukebox has no event named "${eventName}."`);
        }
    }

    async onPlay() {
        this.subscriptions.play.forEach(async (cb) => await cb());
    }

    async onQueueChange() {
        this.subscriptions.queueChange.forEach(async (cb) => await cb());
    }

    enqueue(content) {
        console.log("*****************CURRENT QUEUE****************")
        console.log(this.queue.map(x => x.title))
        if (content instanceof Array) {
            this.queue.push(...content);
            this.onQueueChange();
        } else if (content instanceof Song) {
            this.queue.push(content);
            this.onQueueChange();
        }
        console.log("*****************NEW QUEUE****************")
        console.log(this.queue.map(x => x.title))
    }

    setQueue(content) {
        this.queue = content;
        this.onQueueChange();
    }

    updateQueue() {
        // Remove song from queue
        const song = this.queue.shift();
        /*
        // Shuffle queue if enabled
        if (this.shuffle) {
            for (let i = queue.length - 1; i > 0; i--) {
                randInd = Math.floor(Math.random() * (i + 1));
                [queue[i], queue[randInd]] = [queue[randInd], queue[i]];
            }
        }
        */
        // Add song back if looping is on
        if (this.loop === "all") {
            this.queue.push(song);
        } else if (this.loop === "current") {
            this.queue.unshift(song);
        }
        this.onQueueChange();
    }

    getConnection(voiceChannel) {
        this.currentVoiceChannel = voiceChannel;
        let connection = getVoiceConnection(this.currentVoiceChannel.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({
                channelId: this.currentVoiceChannel.id,
                guildId: this.currentVoiceChannel.guild.id,
                adapterCreator: this.currentVoiceChannel.guild.voiceAdapterCreator,
            });
            connection.subscribe(this.player);
        }
        return connection;
    }

    startPlaying(discordObj) {
        this.currentTextChannel = discordObj.channel;
        this.play(getVoiceChannel(discordObj));
    }

    async play(voiceChannel) {
        if (this.isBusy) {
            return;
        }
        this.isBusy = true;

        this.getConnection(voiceChannel);

        try {
            this.queue[0].getResource().volume.setVolume(this.volume);
            this.player.play(this.queue[0].getResource());
        } catch (e) {
            return this.handleError(e);
        }

        this.isBusy = false;
    }

    async handleError(e) {
        this.currentTextChannel?.send(
            "Something has gone wrong. I cannot play the next song. I am ashamed."
        );
        console.error(e);
    }

    pause() {
        if (this.player.state.status == AudioPlayerStatus.Playing) {
            this.player.pause();
            return { response: "Song paused :play_pause:" }
        } else {
            return { response: "Um... sorry, looks like I'm not playing music at the moment. Put some songs in the queue!" }
        }
    }

    resume(options = {}) {
        if (this.player.state.status == AudioPlayerStatus.Paused) {
            if (options.quiet) {
                this.silenceNextPlay = true;
            }
            this.player.unpause();
            return { response: "Song resumed :play_pause:" }
        } else {
            return { response: "Um... sorry, looks like I'm not currently paused." }
        }
    }

    pauseResume(options = {}) {
        if (this.player.state.status == AudioPlayerStatus.Paused) {
            return this.resume(options);
        } else {
            return this.pause(options);
        }
    }

    clear() {
        if (this.player.state.status != AudioPlayerStatus.Idle) {
            this.queue = [];
            this.player.stop();
            this.onQueueChange();
            return { response: "Queue cleared" }
        } else {
            return { response: "Um... sorry, looks like I'm not playing music at the moment. Put some songs in the queue!" }
        }
    }

    skip() {
        if (this.player.state.status != AudioPlayerStatus.Idle) {
            this.player.stop();
            if (this.queue.length < 2 && this.player.state.status == AudioPlayerStatus.Paused) {
                this.player.unpause();
            }
            return { response: "" }
        } else {
            return { response: "Um... sorry, looks like I'm not playing music at the moment. Put some songs in the queue!" }
        }
    }

    remove(index = 0) {
        if (!this.queue.length) {
            return { response: "There are no songs in queue!" }
        }
        if (this.queue[index]) {
            this.queue.splice(index, 0);
            this.onQueueChange();
            return { response: "Song removed!" }
        } else {
            return { response: `No song at position ${index}!` }
        }
    }

    setVolume(level) {
        if (this.isBusy || !this.queue[0]) {
            return { response: "" }
        }
        this.queue[0].getResource().volume.setVolume(level);
        this.volume = level;
        return { response: "Volume set" }
    }
    
    async fadeVolume(level, length) {
        if (this.isBusy || !this.queue[0]) {
            return { response: "" }
        }
        this.isBusy = true;
        await fade(this.queue[0].getResource(), level, length);
        this.volume = level;
        this.isBusy = false;
        return { response: "Volume set" }
    }

    shuffle() {
        shuffleInPlace(this.queue);
        this.onQueueChange();
    }

    setLoop(type) {
        if (type === "toggle") {
            switch (this.loop) {
                case "none":
                    type = "current";
                    break;
                case "current":
                    type = "all";
                    break;
                case "all":
                    type = "none";
                    break;
            }
        }
        this.loop = type;
    }

    getQueueInfo() {
        if (this.queue.length == 0)
            return { response: "There are no songs in queue!" }
        const titleArray = this.queue.map((song) => song.title);
        var queueEmbed = new MessageEmbed()
            .setColor("#fafa32")
        let list = '';
        for (let i = 0; i < titleArray.length; i++) {
            list += (`${i + 1}: ${titleArray[i]}\n`);
        }
        queueEmbed.addField('Current Music Queue', list || '(empty)');
        return { response: "", embed: queueEmbed };
    }
};
