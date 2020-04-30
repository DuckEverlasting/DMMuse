const { Command } = require('discord.js-commando');

module.exports = module.exports = class RollDice extends Command {
	constructor(client) {
		super(client, {
			name: 'rolldice',
			group: 'gameplay',
      memberName: 'rolldice',
      aliases: ['roll', 'r'],
      description: 'Rolls some dice for you. As many as you want.',
      examples: ['rollDice 1d20+1', 'r 4d6k3', 'r 3d23+7kl1+20-1d3+2d2-12'],
      args: [
        {
          key: "request",
          prompt: "What would you like me to roll?",
          type: "dicerequest"
        }
      ]
		});
	}

	run(message, { request }) {
    const results = request.array.map(match => {
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
    let resultString = `Rolling ${"`"}${request.original}${"`"}...\n`;
    let cumResult = 0;
    results.forEach((result, index) => {
      if (!result.rolls.length) {
        if (result.result >= 0 && index !== 0) {
          resultString += (" + " + result.result);
        } else if (result.result < 0 && index !== 0) {
          resultString += " - " + Math.abs(result.result)
        } else {
          resultString += result.result;
        }
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
    return message.reply(resultString);
  }
};

function rollAction(sides, numberOfRolls=1, add=0, keepNumber=numberOfRolls, keepLesser=false) {
  const rolls = [];
  
  for (let i = 0; i < numberOfRolls; i++) {
    let num = Math.ceil(Math.random() * sides);
    rolls.push({num, kept: true});
  }

  for (let i = 0; i < numberOfRolls - keepNumber; i++) {
    let remainingRolls = rolls.filter(roll => roll.kept).map(roll => roll.num);
    if (keepLesser) {
      let largest = Math.max(...remainingRolls);
      rolls.find(roll => roll.num === largest && roll.kept).kept = false;
    } else {
      let smallest = Math.min(...remainingRolls);
      rolls.find(roll => roll.num === smallest && roll.kept).kept = false;
    }
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  let remainingRolls = rolls.filter(roll => roll.kept).map(roll => roll.num);
  let result = remainingRolls.reduce(reducer, add);


  return ({ rolls, add, result })
}