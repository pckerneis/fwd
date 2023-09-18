// Output text to console
log('Hello, World!');

// Play a few notes
// note(36, 127, 1);

// Schedule
at(1, () => {
  log('Scheduled action.')
  note(40, 127, 1);
});

// Loop
// every(4, 2, () => {
//   note(40, 127, 1);
// });

