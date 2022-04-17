class DiceRequest {
  parse(val) {
    const parsed = []
    const parseExp = /(((?<rolls>[+-]?\d+)d(?<sides>\d+))(?<addend>[+-]\d+)?(?<keep>kl?\d*)?|(?<constant>[+-]?\d+))/gi;
    let res;
    do {
      res = parseExp.exec(val);
      if (res) {
        parsed.push(res);
      }
    } while (res);
    return {
      original: val,
      array: parsed
    };
  }

  validate(val, msg, arg) {
    if (!val.length) {return false}
    const parseExp = /(((?<rolls>[+-]?\d+)d(?<sides>\d+))(?<addend>[+-]\d+)?(?<keep>kl?\d*)?|(?<constant>[+-]?\d+))/g;
    return parseExp.test(val);
  }
}

module.exports = client => new DiceRequest(client);