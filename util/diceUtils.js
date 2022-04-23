
function parse(val) {
    const parsed = [];
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
        array: parsed,
    };
}

function rollAction(
    sides,
    numberOfRolls = 1,
    add = 0,
    keepNumber = numberOfRolls,
    keepLesser = false
) {
    const rolls = [];

    for (let i = 0; i < numberOfRolls; i++) {
        let num = Math.ceil(Math.random() * sides);
        rolls.push({ num, kept: true });
    }

    for (let i = 0; i < numberOfRolls - keepNumber; i++) {
        let remainingRolls = rolls
            .filter((roll) => roll.kept)
            .map((roll) => roll.num);
        if (keepLesser) {
            let largest = Math.max(...remainingRolls);
            rolls.find(
                (roll) => roll.num === largest && roll.kept
            ).kept = false;
        } else {
            let smallest = Math.min(...remainingRolls);
            rolls.find(
                (roll) => roll.num === smallest && roll.kept
            ).kept = false;
        }
    }

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let remainingRolls = rolls
        .filter((roll) => roll.kept)
        .map((roll) => roll.num);
    let result = remainingRolls.reduce(reducer, add);

    return { rolls, add, result };
}

function getResultString(results, request) {
    let resultString = `Rolling ${"`"}${request.original}${"`"}...\n`;
    let cumResult = 0;
    results.forEach((result, index) => {
        if (!result.rolls.length) {
            if (result.result >= 0 && index !== 0) {
                resultString += " + " + result.result;
            } else if (result.result < 0 && index !== 0) {
                resultString += " - " + Math.abs(result.result);
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
                addend = "";
            } else if (result.add > 0) {
                addend = `+${result.add}`;
            } else {
                addend = `${result.add}`;
            }
            result.rolls.forEach((roll) => {
                if (!roll.kept) {
                    resultString += `~~${roll.num}${addend}~~, `;
                } else {
                    resultString += `${roll.num}${addend}, `;
                }
            });
            resultString = resultString.slice(0, resultString.length - 2);
            resultString += ")";
        }
        cumResult += result.result;
    });
    resultString += ` = **${cumResult}**`;
    return resultString;
}

module.exports = {
    parse,
    rollAction,
    getResultString
}