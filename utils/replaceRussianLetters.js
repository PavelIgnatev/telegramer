const replaceRussianLetters = (str) =>
  str.replace(/[А-ЯЁ]/gi, (match) => {
    const russianLetters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const englishLetters = "abvgdeejzijklmnoprstufhzcss_y_eua";
    const index = russianLetters.indexOf(match.toLowerCase());
    return englishLetters[index];
  });

module.exports = { replaceRussianLetters };
