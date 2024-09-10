export const camelToSnakeConverter = (str: string) => str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

export const getTrueCount = (booleans: boolean[]): number => {
  return booleans.filter(Boolean).length;
};

export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    // obj1[key]와 obj2[key]의 타입이 안전하게 비교되도록 타입 단언을 사용
    if (
      !keys2.includes(key) ||
      !deepEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])
    ) {
      return false;
    }
  }

  return true;
}
