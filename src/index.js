import { Command } from 'commander';
import { run } from './modules/cli/run.js';
import { printWelcome } from './modules/cli/display.js';
import { setDebug } from './modules/cli/dbg.js';
import PACKAGE_VERSION from './package-version.cjs';

printWelcome(PACKAGE_VERSION);

const program = new Command();

program
  .name('fwd')
  .version(PACKAGE_VERSION)
  .description('CLI to run musical programs in JS')
  .option('-f, --file <file>', 'path to the program file to run')
  .option('-o, --output <output>', 'midi output to use')
  .option('--headless', 'do not show header')
  .option('-d, --debug', 'launch with debug output')
  .option('--no-watch', 'do not re-execute program when file changes')
  .action(async (options) => {
    setDebug(options.D);
    await run(options.file, options.output, options.headless, options.watch);
  });

program.parse();
