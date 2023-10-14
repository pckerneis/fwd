// Log some text
log('Hello, World!');

// Play a MIDI note
note(36, 127, 1);

// Offset time cursor
wait(2);
flog('Waited for 2. Now is ' + cursor());
note(40, 127, 1);

// Move time cursor after current clock position.
// Try saving the program to trigger these instructions again
at(now() + 1);
flog('1 second after now');

// Moves the cursor to the next multiple of 4
next(4);

// Repeat an action 5 times every 0.25 seconds
repeat(0.25, (i) => log('Repeat #' + i), 5);

// Sets the default MIDI channel to 9
channel(9);

// Play a kick drum every 0.5 seconds.
// You can change the loop while it's playing.
loop('kick', () => {
  note(36, 127, 1);
  wait(0.5);
});

// Play a snare drum every second
loop('snare', () => {
  wait(0.5);
  note(40, 127, 1);
  wait(0.5);
});
