#!/usr/bin/env node

const { spawnSync } = require("child_process");
const path = require("path");

const eslintBin = path.join(
  __dirname,
  "..",
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint"
);

const patterns = ["src/**/*.{ts,tsx,js,jsx}"];
const args = ["-f", "json", ...patterns];

const result = spawnSync(eslintBin, args, {
  cwd: path.join(__dirname, ".."),
  encoding: "utf8",
});

let parsed = [];
try {
  parsed = JSON.parse(result.stdout || "[]");
} catch (_err) {
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  process.exit(result.status || 1);
}

let warningCount = 0;
let errorCount = 0;

const lines = [];
for (const file of parsed) {
  if (!file.messages || file.messages.length === 0) continue;
  const relPath = path.relative(path.join(__dirname, ".."), file.filePath);
  lines.push(relPath);
  for (const msg of file.messages) {
    const line = msg.line ?? 0;
    const col = msg.column ?? 0;
    const rule = msg.ruleId ? `  ${msg.ruleId}` : "";
    lines.push(`  Line ${line}:${col}:  ${msg.message}${rule}`);
    if (msg.severity === 2) {
      errorCount += 1;
    } else if (msg.severity === 1) {
      warningCount += 1;
    }
  }
}

if (lines.length > 0) {
  process.stdout.write("[eslint]\n");
  process.stdout.write(lines.join("\n"));
  process.stdout.write("\n");
}

if (errorCount > 0 || warningCount > 0) {
  process.exit(1);
}

process.exit(0);
