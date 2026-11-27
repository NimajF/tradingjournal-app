const firstTwo = (text: string) =>
  Array.from(text).slice(0, 2).join("").toUpperCase();

export function getInitials(
  displayName: string | null,
  username: string | null,
): string {
  let initialsResult: string;
  const name = displayName?.trim();

  if (name) {
    const words = name.split(/\s+/);
    if (words.length === 1) {
      initialsResult = firstTwo(words[0]);
    } else {
      const firstInitial = Array.from(words[0])[0];

      // If the name has more than one word, use the first letter of the last word as well.
      const lastInitial = Array.from(words[words.length - 1])[0];
      initialsResult = (firstInitial + lastInitial).toUpperCase();
    }
  } else {
    initialsResult = firstTwo(username ?? "") || "?";
  }
  return initialsResult;
}
