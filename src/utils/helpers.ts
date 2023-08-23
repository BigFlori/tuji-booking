export const cloneArray = <T>(array: T[]): T[] => {
  return [...array];
};

export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

//DEBUG
export const sumDuplicates = (array: string[]): number => {
  const countMap: { [key: string]: number } = {};
    let duplicateCount = 0;

    array.forEach(item => {
        countMap[item] = (countMap[item] || 0) + 1;
        if (countMap[item] === 2) {
            duplicateCount++;
        }
    });

    return duplicateCount;
};