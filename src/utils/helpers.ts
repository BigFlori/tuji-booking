//Deep copy egy tömbről
export const cloneArray = <T>(array: T[]): T[] => {
  return [...array];
};

//Eltávolítja a többször előforduló elemeket a tömbből
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

//Megadott méretekre "szeletel" egy tömböt majd visszaadja a tömböt tömbök tömbjeként
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Normalizálja a szöveget: kisbetűsre alakítja, eltávolítja az ékezeteket és a felesleges szóközöket
export const normalizeText = (text: string): string => {
  const lowerCaseText = text.toLowerCase();
  return lowerCaseText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") //Eltávolítja az ékezeteket
    .replace(/\s+/g, " ") //Kicseréli a több szóközt egyre
    .trim();
};

// Számot formáz HUF pénznemre
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

//DEBUG
export const sumDuplicates = (array: string[]): number => {
  const countMap: { [key: string]: number } = {};
  let duplicateCount = 0;

  array.forEach((item) => {
    countMap[item] = (countMap[item] || 0) + 1;
    if (countMap[item] === 2) {
      duplicateCount++;
    }
  });

  return duplicateCount;
};