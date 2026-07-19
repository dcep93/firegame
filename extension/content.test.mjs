import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./content.js", import.meta.url), "utf8");

test("played-card action and target queue labels use explicit line breaks", () => {
  assert.match(source, /actionPosition \? "dequeue\\naction" : "enqueue\\naction"/);
  assert.match(source, /targetPosition \? "dequeue\\ntarget" : "enqueue\\ntarget"/);
});

test("played-card queue buttons preserve label line breaks", () => {
  assert.match(
    source,
    /\.tfmars420-enqueue-tools button \{[\s\S]*?white-space: pre-line;[\s\S]*?\}/,
  );
});
