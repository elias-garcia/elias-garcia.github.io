// How the search matches what is typed against a row's text, and which
// parts of that text it marks. No DOM here: the dialog draws the result.

// Lower case without accents, keeping each character's position in the
// original text, so a match can be marked where it was typed. The folded
// text is searched by UTF-16 unit, so every unit gets its character's
// position: an emoji takes two.
export function fold(text: string): { folded: string; positions: number[] } {
  let folded = "";
  const positions: number[] = [];
  for (const [index, character] of [...text].entries()) {
    const simple = character
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase();
    folded += simple;
    positions.push(...Array.from({ length: simple.length }, () => index));
  }
  return { folded, positions };
}

export function words(query: string): string[] {
  return fold(query).folded.split(/\s+/).filter(Boolean);
}

// Where the term starts a word in the folded text. Matching inside words
// would find "ai" in "daily".
function wordStarts(folded: string, term: string): number[] {
  const starts: number[] = [];
  // An empty term is found at every position, without end.
  if (term === "") {
    return starts;
  }
  let start = folded.indexOf(term);
  while (start !== -1) {
    if (!/[\p{L}\p{N}]/u.test(folded.charAt(start - 1))) {
      starts.push(start);
    }
    start = folded.indexOf(term, start + 1);
  }
  return starts;
}

// Every term starts a word somewhere in the text.
export function matches(text: string, terms: readonly string[]): boolean {
  const { folded } = fold(text);
  return terms.every((term) => wordStarts(folded, term).length > 0);
}

export type Segment = { readonly text: string; readonly marked: boolean };

// The text in runs, with every word start that matches a term marked.
export function markMatches(text: string, terms: readonly string[]): Segment[] {
  const characters = [...text];
  const { folded, positions } = fold(text);
  const marked = Array.from(characters, () => false);
  for (const term of terms) {
    for (const start of wordStarts(folded, term)) {
      for (let index = start; index < start + term.length; index += 1) {
        const position = positions[index];
        if (position !== undefined) {
          marked[position] = true;
        }
      }
    }
  }
  const segments: Segment[] = [];
  let run = "";
  let inMark = false;
  const flush = () => {
    if (run !== "") {
      segments.push({ text: run, marked: inMark });
      run = "";
    }
  };
  for (const [index, character] of characters.entries()) {
    const isMarked = marked[index] ?? false;
    if (isMarked !== inMark) {
      flush();
      inMark = isMarked;
    }
    run += character;
  }
  flush();
  return segments;
}

// The text with its start marked, when it starts with the term.
export function markStart(text: string, term: string): Segment[] {
  const { folded, positions } = fold(text);
  const last = positions[term.length - 1];
  if (last === undefined || !folded.startsWith(term)) {
    return [{ text, marked: false }];
  }
  const characters = [...text];
  return [
    { text: characters.slice(0, last + 1).join(""), marked: true },
    { text: characters.slice(last + 1).join(""), marked: false },
  ].filter((segment) => segment.text !== "");
}
