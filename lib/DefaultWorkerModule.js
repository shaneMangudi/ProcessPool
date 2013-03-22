'use strict';

var      fs = require('fs');
var       _ = require('lodash');

var    root = global;
root.require = require;

function __eval(script) {
    return (eval.bind(root))(script);
}

process.on('message', function(task) {
    if(task.command === 'eval') {
        var result = undefined, error = undefined;
        try {
            result = __eval(message.payload);
        } catch(err) {
            error = err;
        }

        process.send({
            process: process.env.NODE_UNIQUE_ID,
            task: task,
            result: result,
            error: err
        });
    } else if(task.command === 'learn') {
        _.each(task.payload, function(lesson) {
            try {
                __eval(lesson);
            } catch(err) {
                process.send({
                    process: process.env.NODE_UNIQUE_ID,
                    lesson: lesson,
                    error: err
                });
            }
        });

        process.send({
            process: process.env.NODE_UNIQUE_ID,
            task: task,
            result: 'done'
        });
    } else if(message.command === 'kill') {
        process.exit();
    }
});