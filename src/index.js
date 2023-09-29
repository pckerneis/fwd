import { Command } from 'commander';
import { run } from './modules/run.js';
import { printWelcome } from './modules/display.js';
import { setDebug } from './modules/dbg.js';
import PACKAGE_VERSION from './package-version.cjs';

const program = new Command();

program
  .name('fwd')
  .version(PACKAGE_VERSION)
  .description('CLI to run musical programs in JS')
  .option('-f, --file <file>', 'Path to the program file to run')
  .option('-o, --output <output>', 'MIDI output to use')
  .option('--headless', 'Do not show header')
  .option('-d, --debug', 'Launch with debug output')
  .option('-w, --watch', 'Launch with debug output', true)
  .action(async (options) => {
    printWelcome(PACKAGE_VERSION);
    setDebug(options.D);
    await run(options.F, options.O, options.H, options.W);
  });

program.parse();
