import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'fs';

async function run() {
  const inputFile = 'src/modules/api.js';
  const outputFile = 'docs/api-reference.md';
  const template = fs.readFileSync('src/api-template.hbs', 'utf-8');

  const output = await jsdoc2md.render({ files: inputFile, template });
  fs.writeFileSync(outputFile, output);
}

run();
