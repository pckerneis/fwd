import { Command } from 'commander';

import {run} from './modules/run.js';

const program = new Command();

program
    .name('conductor')
    .version('0.0.1')
    .description('CLI to run musical programs in JS');

program.command('run')
    .description('Run a program from a JS file')
    .option('--file, -f <file>', 'Path to the program file to run')
    .option('--bpm, -b <bpm>', 'BPM to run at (defaults to 120)', '120')
    .option('--output, -o <output>', 'MIDI output to use')
    .action(async (options) => {
      await run(options.F, options.O, options.B);
    });

program.parse();
