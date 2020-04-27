const multi_word_replace = {
  
};

const single_word_replace = {
  "r": "roll"
};

const ignore_words = ["a", "an"];

const actions = [
  "roll"
];


// Function to help interpret player commands
module.exports = function parseCommand(command) {
  console.log(command)
  const error = (text = "generic error") => ({
    action: "",
    params: "",
    error: text
  });

  // Edge case
  if (!command.length) return error("no input");

  command = command.toLowerCase();

  // Check input for any phrases to be simplified
  for (let key in multi_word_replace) {
    if (command.includes(key)) {
      command = command.replace(key, multi_word_replace[key]);
    }
  }

  // Split input into words
  command = command.split(" ");

  // Remove unnecessary words
  command = command.filter(el => !ignore_words.includes(el));

  // Check input for any words to replace with recognized commands
  command = command.map(el => {
    if (single_word_replace[el]) {
      el = single_word_replace[el];
    }
    return el;
  });

  // Declare return object
  const result = {
    action: "",
    params: [],
    error: ""
  };

  // Check for action, set it and filter it out of the command
  if (actions.includes(command[0])) {
    result.action = command.shift();
  } else {
    return error("action not recognized");
  }

  // Set items in result and return
  if (command[0]) {
    result.params = command
  }

  return result;
}
