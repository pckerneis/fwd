# Musch 0.0.1

[![Node.js CI](https://github.com/pckerneis/musch/actions/workflows/node.js.yml/badge.svg)](https://github.com/pckerneis/musch/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/pckerneis/musch/graph/badge.svg?token=U4AH1GFZUZ)](https://codecov.io/gh/pckerneis/musch)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/pckerneis/musch)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/pckerneis/musch)
![GitHub](https://img.shields.io/github/license/pckerneis/musch)

A tiny environment for musical composition and live-coding in JavaScript.

![Screenshot](hello-musch.gif)

## Introduction

Musch is a lightweight JavaScript environment designed for musical composition and live-coding. With Musch, you can create dynamic musical compositions on-the-fly by writing code, allowing for real-time adjustments and experimentation.

## Quick start

Get started with Musch in just a few steps:

1. Clone the Project:

```bash
git clone https://github.com/pckerneis/musch.git
cd musch
```

2. Install Dependencies:

```bash
npm ci
```

3. Install Command-Line Runner:

```bash
npm install -g .
```

4. Run Musch:

```bash
musch
```

You'll be prompted to select a text file to read from and a MIDI output to send to. Any changes to the text file trigger the execution of its content, allowing for seamless on-the-fly modification of the running program.

## Example program

Here is a simple program that demonstrates the API basics :

```javascript
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
```

## CLI documentation

See [CLI documentation](cli.md).

## API reference

See [API reference](api-reference.md).
