# API Reference
## Functions

<dl>
<dt><a href="#now">now()</a> ⇒ <code>number</code></dt>
<dd><p>Returns the execution time</p>
</dd>
<dt><a href="#cursor">cursor()</a> ⇒ <code>number</code></dt>
<dd><p>Returns the current time cursor position</p>
</dd>
<dt><a href="#fire">fire(action)</a></dt>
<dd><p>Schedule the function <code>action</code> to be called at the cursor position.</p>
</dd>
<dt><a href="#repeat">repeat(action, interval, count)</a></dt>
<dd><p>Repeatedly calls the function <code>action</code> every <code>interval</code> seconds <code>count</code> times, starting at the cursor position.</p>
</dd>
<dt><a href="#at">at(time)</a></dt>
<dd><p>Move the cursor at position <code>time</code> expressed in seconds.</p>
</dd>
<dt><a href="#wait">wait(duration)</a></dt>
<dd><p>Offset the cursor by <code>duration</code> expressed in seconds.</p>
</dd>
<dt><a href="#note">note(pitch, velocity, duration, [channel])</a></dt>
<dd><p>Schedule a MIDI note to be played at the cursor position
with note number <code>pitch</code>, velocity <code>velocity</code> and duration <code>duration</code> on MIDI channel <code>channel</code>.</p>
</dd>
<dt><a href="#program">program(program, [channel])</a></dt>
<dd><p>Sends a MIDI program change message.</p>
</dd>
<dt><a href="#channel">channel([channelNumber])</a></dt>
<dd><p>Set the default value for next MIDI messages</p>
</dd>
<dt><a href="#pick">pick([...numberOrArrayOrElements])</a> ⇒ <code>*</code></dt>
<dd><p>Pick an element among choices.</p>
<ul>
<li>If an array is provided, the output will be an element of the array</li>
<li>If an string is provided, the output will be a character of the string</li>
<li>If a number is provided, the output will be a number between 0 and this number</li>
<li>For other inputs, the output is a random value between 0 and 1</li>
</ul>
</dd>
<dt><a href="#clear">clear()</a></dt>
<dd><p>Clears the logs.</p>
</dd>
<dt><a href="#fclear">fclear()</a></dt>
<dd><p>Schedule a log clear at the cursor position.</p>
</dd>
<dt><a href="#log">log(...messages)</a></dt>
<dd><p>Log messages tout console output.</p>
</dd>
<dt><a href="#flog">flog(...messages)</a></dt>
<dd><p>Schedule messages to be logged at the cursor position.</p>
</dd>
<dt><a href="#define">define(name, [defaultValue])</a> ⇒ <code>*</code></dt>
<dd><p>Define variable in the execution context with an optional default value.
This won&#39;t have any effects if a value is already defined for <code>name</code>.</p>
</dd>
<dt><a href="#def">def()</a></dt>
<dd><p>Alias for define.</p>
</dd>
<dt><a href="#forget">forget(name)</a></dt>
<dd><p>Undefine variable in the execution context with an optional default value.</p>
</dd>
<dt><a href="#ndef">ndef()</a></dt>
<dd><p>Alias for forget.</p>
</dd>
<dt><a href="#set">set(name, value)</a></dt>
<dd><p>Define or overwrite variable in the execution context with the provided value.
This won&#39;t have any effects if a value is already defined for <code>name</code>.</p>
</dd>
</dl>

<a name="now"></a>

## now() ⇒ <code>number</code>
Returns the execution time

**Kind**: global function  
**Returns**: <code>number</code> - Current execution time  
<a name="cursor"></a>

## cursor() ⇒ <code>number</code>
Returns the current time cursor position

**Kind**: global function  
**Returns**: <code>number</code> - the cursor position  
<a name="fire"></a>

## fire(action)
Schedule the function `action` to be called at the cursor position.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | The action to schedule as a function |

<a name="repeat"></a>

## repeat(action, interval, count)
Repeatedly calls the function `action` every `interval` seconds `count` times, starting at the cursor position.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | The action to repeat |
| interval | <code>number</code> | The repeat interval |
| count | <code>number</code> | How many times to repeat |

<a name="at"></a>

## at(time)
Move the cursor at position `time` expressed in seconds.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>number</code> | Time position in seconds |

<a name="wait"></a>

## wait(duration)
Offset the cursor by `duration` expressed in seconds.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duration | <code>number</code> | Duration in seconds |

<a name="note"></a>

## note(pitch, velocity, duration, [channel])
Schedule a MIDI note to be played at the cursor position
with note number `pitch`, velocity `velocity` and duration `duration` on MIDI channel `channel`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | MIDI note number |
| velocity | <code>number</code> | Velocity value |
| duration | <code>number</code> | Note duration |
| [channel] | <code>number</code> | MIDI channel to send to |

<a name="program"></a>

## program(program, [channel])
Sends a MIDI program change message.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| program | <code>number</code> | MIDI program number |
| [channel] | <code>number</code> | MIDI channel to send to |

<a name="channel"></a>

## channel([channelNumber])
Set the default value for next MIDI messages

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [channelNumber] | <code>number</code> | Default MIDI channel |

<a name="pick"></a>

## pick([...numberOrArrayOrElements]) ⇒ <code>\*</code>
Pick an element among choices.
- If an array is provided, the output will be an element of the array
- If an string is provided, the output will be a character of the string
- If a number is provided, the output will be a number between 0 and this number
- For other inputs, the output is a random value between 0 and 1

**Kind**: global function  
**Returns**: <code>\*</code> - a randomly picked element  

| Param | Type | Description |
| --- | --- | --- |
| [...numberOrArrayOrElements] | <code>Array</code> | choices to pick from as a number, an array or a string |

<a name="clear"></a>

## clear()
Clears the logs.

**Kind**: global function  
<a name="fclear"></a>

## fclear()
Schedule a log clear at the cursor position.

**Kind**: global function  
<a name="log"></a>

## log(...messages)
Log messages tout console output.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ...messages | <code>\*</code> | Messages to log |

<a name="flog"></a>

## flog(...messages)
Schedule messages to be logged at the cursor position.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ...messages | <code>\*</code> | Messages to log |

<a name="define"></a>

## define(name, [defaultValue]) ⇒ <code>\*</code>
Define variable in the execution context with an optional default value.
This won't have any effects if a value is already defined for `name`.

**Kind**: global function  
**Returns**: <code>\*</code> - the named value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The accessor name |
| [defaultValue] | <code>\*</code> | A default value |

<a name="def"></a>

## def()
Alias for define.

**Kind**: global function  
**See**: define(name, defaultValue)  
<a name="forget"></a>

## forget(name)
Undefine variable in the execution context with an optional default value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The accessor name |

<a name="ndef"></a>

## ndef()
Alias for forget.

**Kind**: global function  
**See**: forget(name)  
<a name="set"></a>

## set(name, value)
Define or overwrite variable in the execution context with the provided value.
This won't have any effects if a value is already defined for `name`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The accessor name |
| value | <code>\*</code> | new value |


<style>dl { display: none; }</style>