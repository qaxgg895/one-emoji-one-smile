// One Emoji, One Smile — make.fun entry
// Writes the single warmest emoji to /output/entry.txt.
//
// The emoji: 😇 (U+1F607, smiling face with halo). A gentle closed-eye
// smile with a halo of goodwill. It is warm at first glance, universal
// across ages and backgrounds, a deliberate pick rather than the first
// smiley that comes to mind, and wholesome from a stranger — no irony,
// no intimacy, no flirtation. A stranger glancing at a phone screen
// reads it as kind, and it makes them smile back.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const EMOJI = "😇";

// The gate requires UTF-8 text of 1-8 characters, not only whitespace,
// and the brief requires exactly one emoji and nothing else: refuse to
// write anything that is not a single emoji, so a bad edit can never
// ship a word, a second emoji, or a blank.
const segments = [
  ...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(EMOJI),
];
if (segments.length !== 1) {
  throw new Error(
    `entry must be exactly one emoji, got ${segments.length} grapheme clusters`,
  );
}
if (!/^\p{Extended_Pictographic}$/u.test(EMOJI)) {
  throw new Error("entry must be a single emoji code point");
}
if (/\s/.test(EMOJI)) {
  throw new Error("entry must not contain whitespace");
}

const OUTPUT_PATH = "/output/entry.txt";

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, EMOJI + "\n", "utf8");

// Write-verify: read the file back and refuse to finish unless its
// exact bytes are the emoji plus newline, so a truncated or corrupted
// write can never pass silently.
const written = readFileSync(OUTPUT_PATH);
const expected = Buffer.from(EMOJI + "\n", "utf8");
if (!written.equals(expected)) {
  throw new Error("entry.txt failed write verification");
}
