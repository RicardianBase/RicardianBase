// Basic profanity word list — catches common slurs and offensive terms.
// Case-insensitive matching against the full username and substrings.
const BLOCKED_WORDS = [
  "fuck","shit","ass","bitch","dick","cock","pussy","cunt","nigger","nigga",
  "faggot","fag","retard","whore","slut","porn","nazi","hitler","rape",
  "penis","vagina","anus","bastard","damn","hell","twat","wanker","bollocks",
  "piss","tits","boob","nude","naked","xxx","sex","dildo","cum","jizz",
  "spic","chink","gook","kike","wetback","cracker","honky","tranny",
  "admin","moderator","ricardian","support","official","staff",
];

// Also block lookalikes (leet speak) for the worst slurs
const LEET_MAP: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s",
};

function deLeet(input: string): string {
  return input.split("").map((c) => LEET_MAP[c] ?? c).join("");
}

export function checkProfanity(username: string): { isProfane: boolean; word?: string } {
  const lower = username.toLowerCase();
  const deleeted = deLeet(lower);

  for (const word of BLOCKED_WORDS) {
    if (lower.includes(word) || deleeted.includes(word)) {
      return { isProfane: true, word };
    }
  }

  return { isProfane: false };
}

export function censorText(text: string): string {
  let result = text;
  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "*".repeat(word.length));
  }
  return result;
}
