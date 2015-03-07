# logger.js
Logging module for Node.js

## Levels
The module allows for logging different levels.

```javascript
var logger = require('./logger.js');
logger.log("Log message");
logger.error("Error message"); // Logged to stderr
logger.warn("Warning message"); // Logged to stderr
logger.info("Info message");
logger.debug("Debug message");
```
Produces output in this format, but with colour.
```
[Sat, 07 Mar 2015 19:23:03 GMT] [30019] [LOG] [test.js:2] Log message
[Sat, 07 Mar 2015 19:23:03 GMT] [30019] [ERROR] [test.js:3] Error message
[Sat, 07 Mar 2015 19:23:03 GMT] [30019] [WARN] [test.js:4] Warning message
[Sat, 07 Mar 2015 19:23:03 GMT] [30019] [INFO] [test.js:5] Info message
[Sat, 07 Mar 2015 19:23:03 GMT] [30019] [DEBUG] [test.js:6] Debug message
```

## Override console
The module can take the place of the console, with the original functions available prefixed with _.
This will take effect everywhere.

Like the original functions, multiple arguments can be given.
```javascript
var logger = require('./logger.js');
logger.setConsole(true);
console.log("Log", "message");
console.error("Error message");
console.warn("Warning message");
console.info("Info message");
console.debug("Debug message");

// Call original console.log
console._log("Original console.log");

// Restore original function
logger.setConsole(false);
```

## Formats
The format of the prefixed information and the date can be customised.
The formats are given as strings. The date is formatted using moment.
The following are converted in the information format string. Each can have a colour appended within `{}`.
- D - Date
- P - Process ID. If `logger.showMaster` is true, then the master process will show `master` here.
- L - Level of message. Automatically coloured.
- FF - The filename where the call was made
- LL - The line number where the call was made
- PP - Path to the parent folder of the file

```javascript
var logger = require('./logger.js');
logger.format = "D{green} P{magenta} L{grey}@FF{cyan}:LL{cyan} ";
logger.log("Message");
// outputs in format (with colour)
// Sat, 07 Mar 2015 19:50:28 GMT master INFO@test.js:3 Message

logger.dateFormat = 'DD/MMM/YY HH:mm:ss:SSS Z';
logger.log("Different date format");
// outputs in format (with colour)
// 07/Mar/15 19:47:13:749 +00:00 master INFO@test.js:8 Different date format
```

## Pretty print object
If `logger.prettyObjects` is true (default), the module will attempt to stringify objects as JSON.
If the object cannot be stringified then it will be left as is.
```
var logger = require('./logger.js');
logger.prettyObjects = true; // default is true anway
logger.log({ a: 5 })
// [Sat, 07 Mar 2015 19:59:11 GMT] [30667] [LOG] [test.js:3] {
//    "a": 5
// }

logger.prettyObjects = false;
logger.log({ a: 5 });
// [Sat, 07 Mar 2015 19:59:11 GMT] [30667] [LOG] [test.js:9] { a: 5 }
```

## Streams
By default the module will write to stderr and stdout. A stream can be given to write to instead using `logger.stream`.
```
var logger = require('./logger.js');
logger.stream = require('fs').createWriteStream('output.log');
logger.log("Log message");
logger.error("Error message");
logger.warn("Warning message");
logger.info("Info message");
logger.debug("Debug message");
logger.stream.end();
```
Contents of output.log (output is coloured);
```
[Sat, 07 Mar 2015 20:14:53 GMT] [31328] [LOG] [test.js:3] Log message
[Sat, 07 Mar 2015 20:14:53 GMT] [31328] [ERROR] [test.js:4] Error message
[Sat, 07 Mar 2015 20:14:53 GMT] [31328] [WARN] [test.js:5] Warning message
[Sat, 07 Mar 2015 20:14:53 GMT] [31328] [INFO] [test.js:6] Info message
[Sat, 07 Mar 2015 20:14:53 GMT] [31328] [DEBUG] [test.js:7] Debug message
```
