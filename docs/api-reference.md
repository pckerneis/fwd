# API Reference

Available functions are grouped by their respective modules in this document,
but they are exposed as global functions in the program.

For example, the `Env` module contains the `Env.define` function,
but it is available as `define` in the program.

<a name="module_Env"></a>

## Env

* [Env](#module_Env)
    * [.define(name, [defaultValue])](#module_Env.define) ⇒ <code>Array</code>
    * [.undefine(name)](#module_Env.undefine)

<a name="module_Env.define"></a>

### Env.define(name, [defaultValue]) ⇒ <code>Array</code>
Define a variable with an optional default value. Once defined, the variable can be accessed and changed withthe returned getter and setter functions. The set value is persisted across executions.

**Kind**: static method of [<code>Env</code>](#module_Env)  
**Returns**: <code>Array</code> - A tuple with a getter and a setter  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The accessor name |
| [defaultValue] | <code>\*</code> | An optional default value |

**Example**  
```js
const [getFoo, setFoo] = define('foo');setFoo('bar');getFoo(); // 'bar'
```
<a name="module_Env.undefine"></a>

### Env.undefine(name)
Delete a variable from the execution context.

**Kind**: static method of [<code>Env</code>](#module_Env)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The accessor name |

**Example**  
```js
const [getFoo, setFoo] = define('foo');undefine('foo');getFoo(); // undefined
```
<a name="module_Log"></a>

## Log

* [Log](#module_Log)
    * [.clear()](#module_Log.clear)
    * [.fclear()](#module_Log.fclear)
    * [.log(messages)](#module_Log.log)
    * [.flog(messages)](#module_Log.flog)

<a name="module_Log.clear"></a>

### Log.clear()
Clears the logs.

**Kind**: static method of [<code>Log</code>](#module_Log)  
<a name="module_Log.fclear"></a>

### Log.fclear()
Schedule a log clear at the cursor position.

**Kind**: static method of [<code>Log</code>](#module_Log)  
<a name="module_Log.log"></a>

### Log.log(messages)
Log messages tout console output.

**Kind**: static method of [<code>Log</code>](#module_Log)  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>\*</code> | Messages to log |

<a name="module_Log.flog"></a>

### Log.flog(messages)
Schedule messages to be logged at the cursor position.

**Kind**: static method of [<code>Log</code>](#module_Log)  

| Param | Type | Description |
| --- | --- | --- |
| messages | <code>\*</code> | Messages to log |

<a name="module_MIDI"></a>

## MIDI

* [MIDI](#module_MIDI)
    * [.note(pitch, velocity, [duration], [channel])](#module_MIDI.note)
    * [.program(program, [channel])](#module_MIDI.program)
    * [.cc(controller, value, [channel])](#module_MIDI.cc)
    * [.channel([channelNumber])](#module_MIDI.channel)
    * [.mute(channelNumbers)](#module_MIDI.mute)
    * [.unmute(channelNumbers)](#module_MIDI.unmute)
    * [.solo(channelNumbers)](#module_MIDI.solo)
    * [.unsolo(channelNumbers)](#module_MIDI.unsolo)

<a name="module_MIDI.note"></a>

### MIDI.note(pitch, velocity, [duration], [channel])
Schedule a MIDI note to be played at the cursor positionwith note number `pitch`, velocity `velocity` and duration `duration` on MIDI channel `channel`.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pitch | <code>number</code> |  | MIDI note number |
| velocity | <code>number</code> |  | Velocity value |
| [duration] | <code>number</code> | <code>1</code> | Note duration (defaults to 1) |
| [channel] | <code>number</code> |  | MIDI channel to send to |

**Example**  
```js
// Play a MIDI note with note number 60, velocity 127 for 1 time unit on default channelnote(60, 127);// Play a MIDI note with note number 64, velocity 80 for 2 time units on channel 1note(64, 80, 2, 1);
```
<a name="module_MIDI.program"></a>

### MIDI.program(program, [channel])
Sends a MIDI program change message.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| program | <code>number</code> | MIDI program number |
| [channel] | <code>number</code> | MIDI channel to send to |

<a name="module_MIDI.cc"></a>

### MIDI.cc(controller, value, [channel])
Sends a MIDI continuous controller message.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>number</code> | MIDI program number |
| value | <code>number</code> | new value |
| [channel] | <code>number</code> | MIDI channel to send to |

<a name="module_MIDI.channel"></a>

### MIDI.channel([channelNumber])
Set the default value for next MIDI messages

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| [channelNumber] | <code>number</code> | Default MIDI channel |

**Example**  
```js
channel(9);// Play a MIDI note on channel 9note(60, 127);
```
<a name="module_MIDI.mute"></a>

### MIDI.mute(channelNumbers)
Mute one or more MIDI channels. If none are provided, all channels are muted.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| channelNumbers | <code>number</code> | MIDI channels to mute. |

**Example**  
```js
// Mute channel 1 and 2mute(1, 2);
```
<a name="module_MIDI.unmute"></a>

### MIDI.unmute(channelNumbers)
Unmute one or more MIDI channels. If none are provided, all channels are unmuted.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| channelNumbers | <code>number</code> | MIDI channels to unmute |

<a name="module_MIDI.solo"></a>

### MIDI.solo(channelNumbers)
Solo one or more MIDI channels. If none are provided, all channels are soloed.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| channelNumbers | <code>number</code> | MIDI channels to solo |

<a name="module_MIDI.unsolo"></a>

### MIDI.unsolo(channelNumbers)
Unsolo one or more MIDI channels. If none are provided, all channels are unsoloed.

**Kind**: static method of [<code>MIDI</code>](#module_MIDI)  

| Param | Type | Description |
| --- | --- | --- |
| channelNumbers | <code>number</code> | MIDI channels to unsolo |

<a name="module_Random"></a>

## Random

* [Random](#module_Random)
    * [.setSeed(seed)](#module_Random.setSeed)
    * [.random([min], [max])](#module_Random.random) ⇒ <code>number</code>

<a name="module_Random.setSeed"></a>

### Random.setSeed(seed)
Sets the seed for the random number generator.Setting the seed to the same value will result in the same sequence of random numbers.

**Kind**: static method of [<code>Random</code>](#module_Random)  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>\*</code> | the seed to use |

**Example**  
```js
setSeed('hello, musch!');random(); // 0.6235711870582765random(); // 0.6597003782594609setSeed('hello, musch!');random(); // 0.6235711870582765
```
<a name="module_Random.random"></a>

### Random.random([min], [max]) ⇒ <code>number</code>
Returns a random number between 0 and 1 with optional min and max values.If both min and max are specified, the returned number will be between min and max.If only min is specified, the returned number will be between 0 and min.

**Kind**: static method of [<code>Random</code>](#module_Random)  
**Returns**: <code>number</code> - a random number between 0 and 1  

| Param | Type | Description |
| --- | --- | --- |
| [min] | <code>number</code> | if both arguments are numbers, the minimum value of the random number, else the maximum value |
| [max] | <code>number</code> | if specified, the maximum value of the random number |

**Example**  
```js
random(); // 0.6597003782594609random(10); // 6.419559847089204random(10, 20); // 15.731895383250938random(10, 10); // 10
```
<a name="module_Ring"></a>

## Ring
<a name="module_Ring.ring"></a>

### Ring.ring(...elements) ⇒ <code>function</code>
Creates a ring function.
A ring (or circular buffer) acts like a list whose end is connected to its start.
The returned function takes a positive or negative index and returns the element at that index.
Negative indices are counted from the end of the list. For example, -1 is the last element.
If the index is not an integer, it is rounded down.

**Kind**: static method of [<code>Ring</code>](#module_Ring)  
**Returns**: <code>function</code> - a getter function to retrieve element at index  

| Param | Type | Description |
| --- | --- | --- |
| ...elements | <code>\*</code> | Elements to circle through |

**Example**  
```js
const theRing = ring('a', 'b', 'c');
theRing(-3); // 'a'
theRing(-2); // 'b'
theRing(-1); // 'c'
theRing(0); // 'a'
theRing(1); // 'b'
theRing(2); // 'c'
theRing(3); // 'a'
theRing(1.4); // 'b'
```
<a name="module_Scheduler"></a>

## Scheduler

* [Scheduler](#module_Scheduler)
    * [.now()](#module_Scheduler.now) ⇒ <code>number</code>
    * [.cursor()](#module_Scheduler.cursor) ⇒ <code>number</code>
    * [.fire(action)](#module_Scheduler.fire)
    * [.repeat(interval, action, count)](#module_Scheduler.repeat)
    * [.at(time)](#module_Scheduler.at)
    * [.wait(duration)](#module_Scheduler.wait)
    * [.setSpeed(newSpeed)](#module_Scheduler.setSpeed)
    * [.getSpeed()](#module_Scheduler.getSpeed) ⇒ <code>number</code>
    * [.speed([newSpeed])](#module_Scheduler.speed) ⇒ <code>number</code>
    * [.next(interval)](#module_Scheduler.next)

<a name="module_Scheduler.now"></a>

### Scheduler.now() ⇒ <code>number</code>
Returns the execution time

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  
**Returns**: <code>number</code> - Current execution time  
<a name="module_Scheduler.cursor"></a>

### Scheduler.cursor() ⇒ <code>number</code>
Returns the current time cursor position

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  
**Returns**: <code>number</code> - the cursor position  
**Example**  
```js
cursor(); // 0wait(42);cursor(); // 42
```
<a name="module_Scheduler.fire"></a>

### Scheduler.fire(action)
Schedule the function `action` to be called at the cursor position.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> \| <code>string</code> | The action to schedule as a function or a key |

**Example**  
```js
at(3);// Schedule a function to be called at time 3fire(() => log('Hello World!'));
```
<a name="module_Scheduler.repeat"></a>

### Scheduler.repeat(interval, action, count)
Repeatedly calls the function `action` every `interval`, `count` times, starting at the cursor position.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>number</code> | The repeat interval as a strictly positive number |
| action | <code>function</code> \| <code>string</code> | The action to repeat as a function or a key |
| count | <code>number</code> | How many times to repeat. Defaults to Infinity. |

**Example**  
```js
// Plays a MIDI note every 1 time unitrepeat(1, () => note(64, 127));
```
<a name="module_Scheduler.at"></a>

### Scheduler.at(time)
Move the cursor at position `time`.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>number</code> | Time position to move the cursor to |

**Example**  
```js
// Move the cursor to time 3at(3);// Schedule a function to be called at time 3fire(() => log('Hello World!'));
```
<a name="module_Scheduler.wait"></a>

### Scheduler.wait(duration)
Offset the cursor by `duration`.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | Duration to move the cursor by |

<a name="module_Scheduler.setSpeed"></a>

### Scheduler.setSpeed(newSpeed)
Sets the scheduler's playback speed. Defaults to 1.`newSpeed` must be a strictly positive number, or the function call won't haveany effect.If speed is set to 2, time will tick twice as fast. This is useful for defininga global tempo value.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Type | Description |
| --- | --- | --- |
| newSpeed | <code>number</code> | The new speed value |

<a name="module_Scheduler.getSpeed"></a>

### Scheduler.getSpeed() ⇒ <code>number</code>
Returns the current scheduler's playback speed.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  
<a name="module_Scheduler.speed"></a>

### Scheduler.speed([newSpeed]) ⇒ <code>number</code>
Shortcut for setting and getting scheduler's playback speed.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  
**Returns**: <code>number</code> - Scheduler playback speed after eventual modification  

| Param | Type | Description |
| --- | --- | --- |
| [newSpeed] | <code>number</code> | New speed value. If you pass null, undefined or omit the value, the scheduler's speed won't change. |

**Example**  
```js
// Set the scheduler's playback speed to 2speed(2);// Plays a MIDI note every 0.5 secondsrepeat(1, () => note(64, 127));
```
<a name="module_Scheduler.next"></a>

### Scheduler.next(interval)
Moves the cursor to the next multiple of `interval`.

**Kind**: static method of [<code>Scheduler</code>](#module_Scheduler)  

| Param | Description |
| --- | --- |
| interval | Time interval |

<a name="module_Scope"></a>

## Scope
<a name="module_Scope.scoped"></a>

### Scope.scoped(action)
Call `action` in a new scope. The new scope is a copy of the current scope. The current scope is not modified.

**Kind**: static method of [<code>Scope</code>](#module_Scope)  

| Param | Description |
| --- | --- |
| action | action to call |

**Example**  
```js
scoped(() => {
  wait(4);
  cursor(); // 4
});
cursor(); // 0
```
<a name="module_Smooth"></a>

## Smooth

* [Smooth](#module_Smooth)
    * _static_
        * [.Curve](#module_Smooth.Curve)
        * [.smooth([defaultValue], [defaultCurve])](#module_Smooth.smooth) ⇒ <code>SmoothedValue</code>
    * _inner_
        * [~SmoothedValue](#module_Smooth..SmoothedValue) : <code>Object</code>

<a name="module_Smooth.Curve"></a>

### Smooth.Curve
Curve types for smoothed values.

Available curve types:
- linear
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint

**Kind**: static constant of [<code>Smooth</code>](#module_Smooth)  
<a name="module_Smooth.smooth"></a>

### Smooth.smooth([defaultValue], [defaultCurve]) ⇒ <code>SmoothedValue</code>
Creates a smoothed value.
The value can be set to a target value over a duration with a curve type with `setTarget`.
Subsequent calls to `get` return a value interpolated between the start and target values using
the curve type.

**Kind**: static method of [<code>Smooth</code>](#module_Smooth)  
**Returns**: <code>SmoothedValue</code> - A smoothed value  

| Param | Default | Description |
| --- | --- | --- |
| [defaultValue] | <code>0</code> | The starting value |
| [defaultCurve] | <code>Curve.linear</code> | The default curve type |

**Example**  
```js
// Smoothed value starting at 0 with a default curve of easeInQuad
const value = smooth(0, Curve.easeInQuad);

// Adds a curve from 0 to 10 over 4 time units with a easeInQuad curve
value.setTarget(10, 4);

at(1);
value.get(); // 0.625
at(2);
value.get(); // 2.5
at(3);
value.get(); // 5.625
at(4);
value.get(); // 10
```
<a name="module_Smooth..SmoothedValue"></a>

### Smooth~SmoothedValue : <code>Object</code>
**Kind**: inner typedef of [<code>Smooth</code>](#module_Smooth)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| get | <code>function</code> | Returns the current value |
| setCurve | <code>function</code> | Sets the default curve type |
| setTarget | <code>function</code> | Sets the target value with an optional curve type |

<a name="module_Stepper"></a>

## Stepper

* [Stepper](#module_Stepper)
    * _static_
        * [.stepper(pattern, handler, [continuation], [silence])](#module_Stepper.stepper) ⇒ <code>Stepper</code>
    * _inner_
        * [~Stepper](#module_Stepper..Stepper) : <code>Object</code>
        * [~StepHandlerParameters](#module_Stepper..StepHandlerParameters) : <code>Object</code>
        * [~StepHandler](#module_Stepper..StepHandler) : <code>function</code>

<a name="module_Stepper.stepper"></a>

### Stepper.stepper(pattern, handler, [continuation], [silence]) ⇒ <code>Stepper</code>
Creates a stepper object

**Kind**: static method of [<code>Stepper</code>](#module_Stepper)  
**Returns**: <code>Stepper</code> - the stepper object  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | <code>string</code> |  | The pattern to play |
| handler | <code>StepHandler</code> |  | A function to be called for each step |
| [continuation] | <code>string</code> | <code>&quot;&#x27;~&#x27;&quot;</code> | The step continuation character |
| [silence] | <code>string</code> | <code>&quot;&#x27;_&#x27;&quot;</code> | The step silence character |

**Example**  
```js
const theStepper = stepper('1~2_3~~~_', ({ duration, symbol }) => { log(`Symbol: ${symbol}, duration: ${duration}`);});// Prints "Symbol: 1, duration: 2"theStepper.at(0);// Prints "Symbol: 2, duration: 1"theStepper.at(2);// Prints "Symbol: 3, duration: 4"theStepper.at(4);
```
<a name="module_Stepper..Stepper"></a>

### Stepper~Stepper : <code>Object</code>
**Kind**: inner typedef of [<code>Stepper</code>](#module_Stepper)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| at | <code>function</code> | Calls the handler function for the given step index |

<a name="module_Stepper..StepHandlerParameters"></a>

### Stepper~StepHandlerParameters : <code>Object</code>
**Kind**: inner typedef of [<code>Stepper</code>](#module_Stepper)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | The duration of the step |
| symbol | <code>string</code> \| <code>number</code> | The symbol of the step as a number (integer) or a string (character) |
| line | <code>number</code> | The line of the step |

<a name="module_Stepper..StepHandler"></a>

### Stepper~StepHandler : <code>function</code>
**Kind**: inner typedef of [<code>Stepper</code>](#module_Stepper)  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>StepHandlerParameters</code> | The step object |

<a name="module_Utils"></a>

## Utils

* [Utils](#module_Utils)
    * [.pick([numberOrArrayOrElements])](#module_Utils.pick) ⇒ <code>\*</code>
    * [.iter(iterableOrNumber, callback)](#module_Utils.iter)

<a name="module_Utils.pick"></a>

### Utils.pick([numberOrArrayOrElements]) ⇒ <code>\*</code>
Pick an element among choices.
- If an array is provided, the output will be an element of the array
- If a string is provided, the output will be a character of the string
- If a number is provided, the output will be a number between 0 and this number
- For other inputs, the output is a random value between 0 and 1

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>\*</code> - a randomly picked element  

| Param | Type | Description |
| --- | --- | --- |
| [numberOrArrayOrElements] | <code>Array</code> | choices to pick from as a number, an array or a string |

<a name="module_Utils.iter"></a>

### Utils.iter(iterableOrNumber, callback)
For each element of `iterableOrNumber`, call a function `callback`.
It can iterate over an iterable (such as an Array or a string) or on positive
integers starting from zero.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  

| Param | Type | Description |
| --- | --- | --- |
| iterableOrNumber | <code>number</code> \| <code>string</code> \| <code>Array</code> | iterable or number of iterations |
| callback | <code>function</code> | function to call for each iteration |

