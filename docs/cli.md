# CLI documentation

## Command line arguments

```
Usage: fwd [options]

CLI to run musical programs in JS

Options:
  -V, --version          output the version number
  -f, --file <file>      path to the program file to run
  -o, --output <output>  midi output to use
  --headless             do not show header
  -d, --debug            launch with debug output
  --no-watch             do not re-execute program when file changes
  -h, --help             display help for command
```

## Key bindings

When the program is being executed, the CLI will bind key presses to the following actions:

| key | action |
| --- | --- |
| space | pause/unpause |
| escape | quit |
