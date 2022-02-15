export const is_empty = obj => {
  for (let i in obj) return false;
  return true;
}