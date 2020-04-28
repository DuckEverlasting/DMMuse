module.exports = function({ params }) {
  if (!params.length) throw new Error("What would you like to roll?");
  const string = params.join("");
  const parsed = []
  const parser = /(((?<rolls>[+-]?\d+)d(?<sides>\d+))(?<addend>[+-]\d+)?(?<keep>kl?\d+)?|(?<constant>[+-]?\d+))/g;
  let res;
  do {
    res = parser.exec(string);
    if (res) {
      parsed.push(res);
    }
  } while (res);
  const results = parsed.map(match => {
    if (match.groups.constant) {
      return rollAction(0, 0, new Number(match.groups.constant));
    } else {
      return rollAction(
        new Number(match.groups.sides),
        new Number(match.groups.rolls),
        match.groups.addend ? new Number(match.groups.addend) : undefined,
        match.groups.keep ? new Number(match.groups.keep.match(/\d+/)) : undefined,
        match.groups.keep ? match.groups.keep.includes("l") : undefined
      )
    }
  })
  resultString = `Rolling ${"`"}${string}${"`"}...\n`;
  cumResult = 0;
  results.forEach((result, index) => {
    if (!result.rolls.length) {
      if (result.result >= 0 && index !== 0) {
        resultString += "+";
      }
      resultString += result.result;
    } else {
      if (index !== 0) {
        resultString += " + ";
      }
      resultString += "(";
      let addend;
      if (result.add === 0) {
        addend = ""
      } else if (result.add > 0) {
        addend = `+${result.add}`
      } else {
        addend = `${result.add}`
      }
      result.rolls.forEach(roll => {
        if (!roll.kept) {
          resultString += `~~${roll.num}${addend}~~, `
        } else {
          resultString += `${roll.num}${addend}, `
        }
      })
      resultString = resultString.slice(0, resultString.length - 2);
      resultString += ")";
    }
    cumResult += result.result;
  })
  resultString += ` = **${cumResult}**`;
  return resultString;
}

function rollAction(sides, numberOfRolls=1, add=0, keepNumber=numberOfRolls, keepLesser=false) {
  console.log("Roll Action: ")
  console.log("  Sides: ", sides)
  console.log("  numberOfRolls: ", numberOfRolls)
  console.log("  addend: ", add)
  console.log("  keep: ", keepNumber)
  console.log("  keepLesser: ", keepLesser)
  const rolls = [];
  
  for (let i = 0; i < numberOfRolls; i++) {
    let num = Math.ceil(Math.random() * sides);
    rolls.push({num, kept: true});
  }

  for (let i = 0; i < numberOfRolls - keepNumber; i++) {
    let remainingRolls = rolls.filter(roll => roll.kept).map(roll => roll.num);
    console.log("REMAINING: ", remainingRolls);
    if (keepLesser) {
      let largest = Math.max(...remainingRolls);
      console.log("LARGEST: ", largest);
      let largestRoll = rolls.find(roll => roll.num === largest && roll.kept).kept = false;
      console.log("LARGEST ROLL: ", largestRoll);
    } else {
      let smallest = Math.min(...remainingRolls);
      console.log("SMALLEST: ", smallest);
      let smallestRoll = rolls.find(roll => roll.num === smallest && roll.kept).kept = false;
      console.log("SMALLEST ROLL: ", smallestRoll);
    }
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let remainingRolls = rolls.filter(roll => roll.kept).map(roll => roll.num);
  let result = remainingRolls.reduce(reducer, add);

  console.log("ROLLS: ", rolls)
  console.log("ADD: ", add)
  console.log("RESULT: ", result)

  return ({ rolls, add, result })
}