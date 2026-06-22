const fs = require('fs');

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error('Usage: node md-strip-tables.cjs input.md output.md');
  process.exit(1);
}

const markdown = fs.readFileSync(input, 'utf8');
const lines = markdown.split('\n');
const out = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().startsWith('|')) {
    // Collect the whole table block.
    const tableLines = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      tableLines.push(lines[i]);
      i++;
    }
    i--; // step back so outer loop continues at the next non-table line

    const rows = tableLines
      .map((l) =>
        l
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim())
      )
      .filter((r) => r.some((c) => c.length > 0));

    if (rows.length === 0) continue;

    // Skip separator row (contains ---).
    const dataRows = rows.filter((r) => !r.every((c) => /^[-:]+$/.test(c)));
    if (dataRows.length === 0) continue;

    const header = dataRows[0];
    out.push('');
    for (let r = 1; r < dataRows.length; r++) {
      const cells = dataRows[r];
      const parts = header.map((h, idx) => `**${h}**: ${cells[idx] || ''}`);
      out.push(`- ${parts.join('，')}`);
    }
    out.push('');
  } else {
    out.push(line);
  }
}

fs.writeFileSync(output, out.join('\n'), 'utf8');
console.log(`Wrote ${output}`);
