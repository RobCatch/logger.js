/**
 * Created by rob on 10/9/14.
 */
require('colors');
var moment = require('moment');

var levels = {
    log: 'green',
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'cyan'
};

var isConsole = false;

var logger = {
    stream: null,
    format: null,
    dateFormat: null,
    prettyObjects: true,
    showMaster: false,
    setConsole: function(override){
        if(override && !isConsole) {
            for (var level in levels) {
                if (console[level])
                    console['_' + level] = console[level];
                console[level] = logger[level];
            }
            isConsole = true;
        } else if(!override && isConsole){
            for (var level in levels) {
                console[level] = console['_'+level];
            }
            isConsole = false;
        }
        return logger;
    }
};

for(var level in levels){
    logger[level] = logLevel(level, false);
}

function logLevel(level){
    return function(){
        var path, file, line,
            args = Array.prototype.slice.call(arguments),
            date = logger.dateFormat ? moment().format(logger.dateFormat) : new Date().toUTCString(),
            pid = logger.showMaster && process.isMaster ? 'master' : process.pid,
            info = '';

        function getCallerDetails(index){
            if(path) return;
            try { throw Error('') } catch(err) {
                var caller_line = err.stack.split("\n")[index];
                var matches = caller_line.match(/(\/.+\/(.+)):(\d+):\d+/);
                path = matches[1];
                file = matches[2];
                line = matches[3];
            }
        }

        if(logger.prettyObjects)
            args = prettyArgs(args);

        if(logger.format){
            info = logger.format.replace(/(PP|FF|LL|D|P|L)(?:\{(\w+)\})?/g, function(match, value, color){
                if(value == 'D')
                    value = date;
                else if(value == 'P')
                    value = pid.toString();
                else if(value == 'L')
                    value = level.toUpperCase()[levels[level]];
                else {
                    getCallerDetails(6);
                    if(value == 'PP')
                        value = path;
                    else if(value == 'FF')
                        value = file;
                    else if(value == 'LL')
                        value = line;
                }

                if(color)
                    value = value[color] || value;

                return value;
            });
        } else {
            getCallerDetails(4);
            info = ('[' + date + '] ').magenta +
                ('[' + pid + '] ').green +
                ('[' + level.toUpperCase() + '] ')[levels[level]] +
                ('[' + file + ':' + line + '] ').grey;
        }

        if(logger.stream) {
            logger.stream.write(info + args[0] + '\n');
        } else {
            process[level == 'error' || level == 'warn' ? 'stderr' : 'stdout'].write(info);
            console[(isConsole ? '_' : '') + (level == 'error' || level == 'warn' ? 'error' : 'log')].apply(null, args);
        }
    }
}

function prettyArgs(args){
    for(var i = 0; i < args.length; i++){
        if (typeof args[i] == "object" && args[i] != null) {
            try{
                args[i] = JSON.stringify(args[i], null, 4);
            } catch(err){
                // ignore the error, leaving args[i] as it is
            }
        }
    }
    return args;
}
module.exports = logger;