# fwd

A tiny environment for musical composition and live-coding in JavaScript.

## Quick start

To run from the sources:

- clone the project
- install the NPM dependencies with `npm install -g .`
- run with `fwd`

You'll be prompted a text file to read from, and a MIDI output to send to.

Every change to the text file will trigger the execution of its content,
allowing on-the-fly modification of the program running.

## Example program

Here is a simple program that demonstrates the API basics :

```
// Log some text
log('Hello, World!');

// Play a MIDI note
note(36, 127, 1);

// Offset time cursor
wait(2);
flog('Waited for 2. Now is ' + cursor());
note(40, 127, 1);

// Move time cursor after current clock position.
// Try changing the program to trigger these instructions again
at(now() + 1);
flog('1 second after now');
```

## API reference

See [API reference](api-reference.md).
