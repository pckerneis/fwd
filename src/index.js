import { Command } from 'commander';

import { run } from './modules/run.js';

const program = new Command();

program
  .name('conductor')
  .version('0.0.1')
  .description('CLI to run musical programs in JS')
  .option('--file, -f <file>', 'Path to the program file to run')
  .option('--output, -o <output>', 'MIDI output to use')
  .action(async (options) => {
    await run(options.F, options.O);
  });

program.parse();
