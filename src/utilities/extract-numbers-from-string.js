function extractNumbersFromString(str) {
    const regex = /\d+/g; // match all sequences of one or more digits
    const matches = str.match(regex); // find all matches

    // convert the matched strings to numbers and return them as an array
    return matches.map(match => Number(match));
}

module.exports = { extractNumbersFromString }