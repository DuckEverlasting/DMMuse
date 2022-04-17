module.exports = async function(emojiName) {
    const cache = {
        play_pause: '956341910170140702',
        stop_button: '956345560896516136',
        pause_button: '956345749942185985',
        fast_forward: '956345895358701658',
        repeat: '956346062422020096',
        repeat_one: '956346081439006800',
        blue_square: '956346377842085948',
        track_next: '956346684294721566',
        next_track: '956346684294721566',
        heavy_multiplication_x: '956346980764880917',
        twisted_rightwards_arrows: '956347263687471194',
        regional_indicator_x: '956347598288068660',
    }
    return cache[emojiName]
}
