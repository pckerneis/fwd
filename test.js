// Output text to console

log('Hello, World!');
note(36, 127, 1);

wait(2);
flog("Waited for 2. Now is " + cursor());
note(40, 127, 1);

at(now() + 1);
flog("1 second after now");
note(39, 127, 1);

// Loop

// every(4, 2, () => {
//   note(40, 127, 1);
// });

