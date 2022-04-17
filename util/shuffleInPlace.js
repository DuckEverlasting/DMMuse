module.exports = function(array) {
    for (let i = 0; i < array.length; i++) {
        let rand = Math.floor(Math.random() * array.length);
        let placeholder = array[i];
        array[i] = array[rand];
        array[rand] = placeholder;
    }
}
