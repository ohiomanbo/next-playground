export const camelToSnakeConverter = (str: string) => str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

export const checkTrueCount = (booleans: boolean[], count: number): boolean => {
  return booleans.filter(Boolean).length === count;
};
