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
