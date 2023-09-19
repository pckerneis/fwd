# conductor-cli

A tiny environment for musical composition and live-coding in JavaScript.

## Quick start

Clone the project, install the NPM dependencies and run the `start` script.

You'll be prompted a text file to read from and a MIDI output to send to.

Every change to the text file will trigger the execution of its content, allowing on-the-fly modification of the program running.

## API

### `at(t)`

Move the active cursor at position `t` expressed in seconds.

### `wait(d)`

Offset the active cursor by `d` expressed in seconds.

### `fire(fn)`

Schedule the function `fn` to be called at the active cursor position.

### `note(p, v, d, c)`

Schedule a MIDI note to be played at the active cursor position
with note number `n`, velocity `v` and duration `d` on midi channel `c`.

### `noteOn(p, v, c)`

Schedule a MIDI note on message to be sent at the active cursor position
with note number `n` and velocity `v` on midi channel `c`.

### `noteOff(p, v, c)`

Schedule a MIDI note off message to be sent at the active cursor position
with note number `n` and velocity `v` on midi channel `c`.
