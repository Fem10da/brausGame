function shuffleArray(array) {
  if (!array || !Array.isArray(array) || array.length <= 1) {
    return array || [];
  }
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  let isSame = true;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== shuffled[i]) {
      isSame = false;
      break;
    }
  }
  if (isSame && array.length > 2) {
    return shuffleArray(array);
  }
  return shuffled;
}

module.exports = shuffleArray;
