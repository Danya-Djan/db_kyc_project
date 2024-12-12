export function declension (count, firstString, secondString, otherString, isNumber) {
    let countString;

    if (
      count.toString().slice(-1) === "1" &&
      count.toString()[count.toString().length - 2] != "1"
    ) {
      countString = isNumber ? `${count} ${firstString}` : firstString;
    } else if (
      (count.toString().slice(-1) === "2" &&
        count.toString()[count.toString().length - 2] != "1") ||
      (count.toString().slice(-1) === "3" &&
        count.toString()[count.toString().length - 2] != "1") ||
      (count.toString().slice(-1) === "4" &&
        count.toString()[count.toString().length - 2] != "1")
    ) {
      countString = isNumber ? `${count} ${secondString}` : secondString;
    } else {
      countString = isNumber ? `${count} ${otherString}` : otherString;
    }

    return countString
}