// Log some text
log('Hello, World!');

// Play a MIDI note with note number 36, velocity 127, and duration 1
note(36, 127, 1);

// Offset time cursor
wait(2);

// `flog` logs to the console at the current cursor position
// `cursor` returns the current cursor position
flog('Waited for 2. Now is ' + cursor());

// Play another MIDI note 2 seconds after the first one
// The fourth argument (optional) is the MIDI channel
note(40, 127, 1, 1);

// Move time cursor 1 second after current clock position
// Try saving the program to trigger the following instructions again
at(now() + 1);
flog('1 second after now');

// Moves the cursor to the next multiple of 4
next(4);

// Repeat an action 5 times every 0.25 seconds
repeat(0.25, (i) => log('Repeat #' + i), 5);

// Sets the default MIDI channel to 9 for subsequent calls to `note` without a channel argument
channel(9);
