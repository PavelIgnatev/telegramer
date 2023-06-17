function generateRandomTime() {
  const minTime = 14400000; // 4 hours in milliseconds
  const maxTime = 28800000; // 8 hours in milliseconds

  const randomTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return randomTime;
}

module.exports = { generateRandomTime };
