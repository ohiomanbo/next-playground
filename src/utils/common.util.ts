export const camelToSnakeConverter = (str: string) => str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

export const getTrueCount = (booleans: boolean[]): number => {
  return booleans.filter(Boolean).length;
};
