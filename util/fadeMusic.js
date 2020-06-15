module.exports = async function fadeMusic(dispatcher, value, speed = 1) {
  console.log("FADING...")
  let target = null;
  if (!value) {
    target = dispatcher.volume > 0 ? 0 : 1;
  } else if (typeof value === "number") {
    target = Math.max(Math.min(value, 2), 0);
  } else if (value in terms) {
    if (terms.value === 0 || dispatcher.volume < terms.value) {
      target = terms.value;
    }
  }

  if (target !== null && target !== dispatcher.volume) {
    const fadeInterval = (target - dispatcher.volume) / (5 * speed);

    while(dispatcher.volume !== target) {
      await dispatcher.setVolume(dispatcher.volume + fadeInterval);
      if (fadeInterval > 0) {
        if (dispatcher.volume > target) {
          await dispatcher.setVolume(target);
        }
      } else {
        if (dispatcher.volume < target) {
          await dispatcher.setVolume(target);
        }
      }
      console.log(dispatcher.volume)
      await wait(500);
    }
  }
}

const wait = ms => {
  return new Promise((res, rej) => setTimeout(res, ms))
}
