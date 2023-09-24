import { Command } from 'commander';
import { run } from './modules/run.js';
import packagejson from '../package.json' assert { type: 'json' };
import { printWelcome } from './modules/display.js';
import { setDebug } from './modules/dbg.js';

printWelcome(packagejson.version);

const program = new Command();

program
  .name('conductor')
  .version(packagejson.version)
  .description('CLI to run musical programs in JS')
  .option('--file, -f <file>', 'Path to the program file to run')
  .option('--output, -o <output>', 'MIDI output to use')
  .option('--debug, -d', 'Launch with debug output')
  .action(async (options) => {
    setDebug(options.D);
    await run(options.F, options.O);
  });

program.parse();
