import jsdoc2md from 'jsdoc-to-markdown';
import fs from 'node:fs';
import { exec } from 'node:child_process';

async function writeApiReference() {
  const inputFile = 'src/modules/api.js';
  const outputFile = 'docs/api-reference.md';
  const template = fs.readFileSync('src/api-template.hbs', 'utf-8');

  const output = await jsdoc2md.render({ files: inputFile, template });
  fs.writeFileSync(outputFile, output);
}

function writeCliDocumentation() {
  const outputFile = 'docs/cli.md';
  const template = fs.readFileSync('src/cli-template.hbs', 'utf-8');
  const childProcess = exec('fwd -h');

  childProcess.stdout.on('data', function (data) {
    fs.writeFileSync(outputFile, template.replace('{{help}}', data));
  });
}

async function run() {
  await writeApiReference();
  writeCliDocumentation();
}

run();
