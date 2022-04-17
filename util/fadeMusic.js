module.exports = async function fadeMusic(resource, value, speed = 2) {
  console.log("FADING...")
  let target = null;
  if (!value) {
    target = resource.volume.volume > 0 ? 0 : 1;
  } else if (typeof value === "number") {
    target = Math.max(Math.min(value, 2), 0);
  } else if (value in terms) {
    if (terms.value === 0 || resource.volume.volume < terms.value) {
      target = terms.value;
    }
  }
  speed = Math.max(.25, Math.min(speed, 20));
  console.log("SPEED: " + speed);

  if (target !== null && target !== resource.volume.volume) {
    const fadeInterval = (target - resource.volume.volume) / (8 * speed);
    let time = Date.now();
    let count = 0;
    while(resource.volume.volume !== target) {
      await resource.volume.setVolume(resource.volume.volume + fadeInterval);
      count++
      if (fadeInterval > 0) {
        if (resource.volume.volume > target) {
          await resource.volume.setVolume(target);
        }
      } else {
        if (resource.volume.volume < target) {
          await resource.volume.setVolume(target);
        }
      }
      console.log(resource.volume.volume)
      await wait(125);
    }
    console.log(`TIME: ${Date.now() - time}`);
    console.log("COUNT: " + count)
  }
}

const wait = ms => {
  return new Promise((res, rej) => setTimeout(res, ms))
}
