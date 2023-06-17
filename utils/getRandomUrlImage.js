const fs = require("fs");
const path = require("path");

function getRandomImageFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const randomIndex = Math.floor(Math.random() * files.length);
  const randomImagePath = path.join(folderPath, files[randomIndex]);
  return randomImagePath;
}

module.exports = { getRandomImageFromFolder };
