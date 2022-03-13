const fs = require("fs");
const { Command } = require("discord.js-commando");
const tarrokaData = require("../../tarroka_data.json");
const { createCanvas, loadImage } = require("canvas");
const { dirname } = require("path");
const __maindir = dirname(require.main.filename);

module.exports = module.exports = class Tarroka extends Command {
  constructor(client) {
    super(client, {
      name: "tarroka",
      group: "gameplay",
      memberName: "tarroka",
      description: "Call upon fate.",
    });
  }

  run(message) {
    const [leftCard, topCard, rightCard] = this.getCards(3, tarrokaData.cards.common_deck);
    const [middleCard, bottomCard] = this.getCards(2, tarrokaData.cards.high_deck);

    const messageText = [leftCard, topCard, rightCard, middleCard, bottomCard]
      .map((card) => this.getCardText(card))
      .join("\n\n");

    let placeholderMessage;
    message.channel
      .send("Placing the cards...")
      .then((msg) => (placeholderMessage = msg))
      .then(() =>
        this.render(leftCard, topCard, rightCard, middleCard, bottomCard)
      )
      .then(() => {
        message.channel
          .send("", { files: [`${__maindir}\\media\\latestReading.png`] })
          .then(() => {
            placeholderMessage.delete();
            message.channel.send("\n" + messageText);
          });
      });
  }

  getCards(num, deck) {
    let randomIndex;
    let currentIndex = deck.length;

    const deckCopy = [...deck];

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [deckCopy[currentIndex], deckCopy[randomIndex]] = [
        deckCopy[randomIndex],
        deckCopy[currentIndex],
      ];
    }

    return deckCopy.slice(0, num);
  }

  getCardText(card) {
    return `----- ${card.name} -----\n${card.represents}`;
  }

  async render(leftCard, topCard, rightCard, middleCard, bottomCard) {
    const canvas = createCanvas(1200, 1600);
    const ctx = canvas.getContext("2d");

    function drawRotated(image, x, y, w, h, degrees) {
      // save the unrotated context of the canvas so we can restore it later
      // the alternative is to untranslate & unrotate after drawing
      ctx.save();

      // move to the center of the canvas
      ctx.translate(x + 0.5 * w, y + 0.5 * h);

      // rotate the canvas to the specified degrees
      ctx.rotate((degrees * Math.PI) / 180);

      // draw the image
      // since the context is rotated, the image will be rotated also
      ctx.drawImage(image, -w / 2, -h / 2, w, h);

      // we’re done with the rotating so restore the unrotated context
      ctx.restore();
    }

    await loadImage(`${__maindir}\\media\\template.png`).then((image) => {
      ctx.drawImage(image, 0, 0);
    });
    await loadImage(`${__maindir}\\media\\${leftCard.image}`).then((image) => {
      drawRotated(
        image,
        120,
        545 + Math.floor(Math.random() * 40),
        315,
        440,
        -3 + Math.random() * 6
      );
    });
    await loadImage(`${__maindir}\\media\\${topCard.image}`).then((image) => {
      drawRotated(
        image,
        445 + Math.floor(Math.random() * 30),
        95 + Math.floor(Math.random() * 30),
        315,
        440,
        -3 + Math.random() * 6
      );
    });
    await loadImage(`${__maindir}\\media\\${rightCard.image}`).then((image) => {
      drawRotated(
        image,
        800,
        545 + Math.floor(Math.random() * 40),
        315,
        440,
        -3 + Math.random() * 6
      );
    });
    await loadImage(`${__maindir}\\media\\${middleCard.image}`).then(
      (image) => {
        drawRotated(
          image,
          445 + Math.floor(Math.random() * 30),
          565 + Math.floor(Math.random() * 20),
          315,
          440,
          -3 + Math.random() * 6
        );
      }
    );
    await loadImage(`${__maindir}\\media\\${bottomCard.image}`).then(
      (image) => {
        drawRotated(
          image,
          445 + Math.floor(Math.random() * 30),
          1025 + Math.floor(Math.random() * 30),
          315,
          440,
          -3 + Math.random() * 6
        );
      }
    );
    await loadImage(`${__maindir}\\media\\glow.png`).then((image) => {
      ctx.drawImage(image, 0, 0);
    });

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`${__maindir}\\media\\latestReading.png`, buffer);
  }
};
