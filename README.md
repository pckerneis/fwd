# fwd

A tiny environment for musical composition and live-coding in JavaScript.

## Quick start

To run from the sources:

- clone the project
- install the NPM dependencies with `npm install`
- run with `npm run start`

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

## API

### `cursor()`

Returns the cursor position.

### `now()`

Returns the clock position.

### `log(msg)`

Log a message.

### `flog(msg)`

Schedule a message to be logged at the cursor position.

### `at(t)`

Move the cursor at position `t` expressed in seconds.

### `wait(d)`

Offset the cursor by `d` expressed in seconds.

### `fire(fn)`

Schedule the function `fn` to be called at the cursor position.

### `repeat(fn, interval, count = Infinity)`

Repeatedly calls the function `fn` every `interval` seconds for `count` times, starting at the cursor position.

### `note(p, v, d, c)`

Schedule a MIDI note to be played at the cursor position
with note number `n`, velocity `v` and duration `d` on midi channel `c`.

### `noteOn(p, v, c)`

Schedule a MIDI note-on message to be sent at the cursor position
with note number `n` and velocity `v` on midi channel `c`.

### `noteOff(p, v, c)`

Schedule a MIDI note-off message to be sent at the cursor position
with note number `n` and velocity `v` on midi channel `c`.
